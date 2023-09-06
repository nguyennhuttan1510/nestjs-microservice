import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decorators';
import { AuthService } from '@authentication/auth/auth.service';
import { Auth } from '@authentication/auth/entities/auth.entity';
import { ALLOW_FIRST_ACCESS } from '@authentication/auth/decorators/allow_first_access.decorators';
import { Account } from '@authentication/account/entities/account.entity';

export type Token = Account & { session_id: string };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const isAllowFirstAccess = this.reflector.getAllAndOverride<boolean>(
      ALLOW_FIRST_ACCESS,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Request access token');
    }

    let payload: Token;
    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_JWT,
      });
    } catch (e) {
      const tokenDecode = this.jwtService.decode(token);
      if (typeof tokenDecode === 'object' && tokenDecode.session_id) {
        const authEntity: Partial<Auth> = {
          cancel: true,
        };
        await this.authService.update(tokenDecode.session_id, authEntity);
      }
      throw new UnauthorizedException('Token is invalid or expired');
    }

    try {
      //CHECK SESSION IS CANCEL
      await this.checkTokenCancel(payload.session_id);
      if (!isAllowFirstAccess) {
        //CHECK IN PROGRESS INTI USER
        await this.checkIsInProgressInitUser(payload);
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.headers['jwt'] = payload;
    } catch (e) {
      throw e;
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async checkTokenCancel(session_id: string): Promise<void> {
    try {
      if (!session_id)
        throw new InternalServerErrorException('Not found session');
      const auth: Auth = await this.authService.findOne(session_id);
      console.log('auth', auth);
      if (!auth || auth.cancel) {
        throw new UnauthorizedException(
          'Any one is accessing your account!, Please sign in again and change password',
        );
      }
    } catch (e) {
      throw e;
    }
  }

  private async checkIsInProgressInitUser(payload: Token) {
    await this.checkIsFirstTimeAccess(payload);
  }

  private async checkIsFirstTimeAccess(payload: Token) {
    if (payload.is_first_access)
      throw new ForbiddenException(
        'Can not any access, when you have not change password',
      );
  }
}
