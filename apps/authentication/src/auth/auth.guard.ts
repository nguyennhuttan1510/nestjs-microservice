import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './decorators/public.decarators';
import { AuthService } from '@authentication/auth/auth.service';
import { Auth } from '@authentication/auth/entities/auth.entity';

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
    console.log('isPublic', isPublic);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Request access token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_JWT,
      });
      //CHECK SESSION IS CANCEL
      await this.checkTokenCancel(payload?.session_id);
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request.headers['jwt'] = payload;
    } catch (e) {
      const tokenDecode = this.jwtService.decode(token);
      if (typeof tokenDecode === 'object' && tokenDecode.session_id) {
        const authEntity: Partial<Auth> = {
          cancel: true,
        };
        await this.authService.update(tokenDecode.session_id, authEntity);
      }

      throw new UnauthorizedException(
        e.message || 'Token is invalid or expired',
      );
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async checkTokenCancel(session_id: string): Promise<void> {
    if (!session_id) throw new Error('Not found session');
    const auth: Auth = await this.authService.findOne(session_id);
    if (!auth || auth.cancel) {
      throw new Error(
        'Any one is accessing your account!, Please sign in again and change password',
      );
    }
  }
}
