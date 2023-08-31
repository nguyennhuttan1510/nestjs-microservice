import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { Auth } from '@authentication/auth/entities/auth.entity';
import { User } from '@authentication/users/entities/user.entity';
import { Account } from '@authentication/account/entities/account.entity';
import { AccountService } from '@authentication/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@authentication/users/users.service';
import Helper from '@authentication/utils/helper';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { v4 as uuidV4 } from 'uuid';
import { ResetPasswordDto } from '../../../mail/src/dto/reset-password.dto';
import { AxiosResponse } from 'axios';
import { Response } from '@app/interceptor';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    @Inject(forwardRef(() => AccountService))
    readonly accountService: AccountService,
    @Inject(forwardRef(() => UsersService))
    readonly userService: UsersService,
    private jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  private findOneOption(id: string): FindOneOptions<Auth> {
    return {
      where: {
        session_id: id,
      },
    };
  }

  findAll() {
    return `This action returns all auth`;
  }

  async findOne(
    id: string,
    option: FindOneOptions<Auth> = this.findOneOption(id),
  ) {
    try {
      return await this.authRepository.findOne(option);
    } catch (e) {
      throw e;
    }
  }

  async update(id: string, auth: Partial<Auth>) {
    try {
      return await this.authRepository.update(id, auth);
    } catch (e) {
      throw e;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async signin(
    account: Partial<Account>,
  ): Promise<Partial<{ access_token: string }>> {
    try {
      //CHECK EXISTED ACCOUNT, COMPARE PASSWORD
      const { account: accountEntity, isExisted } =
        await this.accountService.checkExistAccount(account.username);

      const isMatchPassword = await Helper.comparePassword(
        account.password,
        accountEntity.password,
      );

      if (!isExisted || !isMatchPassword) {
        throw new UnauthorizedException('Username or Password invalid');
      }

      //CHECK VERIFY EMAIL
      if (!accountEntity.user.is_verify_email)
        throw new UnauthorizedException(
          'Please check mail to verify account, https://mail.google.com/',
        );

      //CHECK TOKEN IS WORKING, THEN CANCEL IT
      const auth = await this.findOne(null, {
        where: {
          cancel: false,
          account: accountEntity.account_id,
        },
      });
      if (auth) {
        await this.update(auth.session_id, {
          cancel: true,
        });
      }

      //GENERATE TOKEN
      const sessionId = uuidV4();
      const accessToken: string = await this.jwtService.signAsync({
        ...accountEntity,
        session_id: sessionId,
      });

      await this.authRepository.save({
        session_id: sessionId,
        account: accountEntity,
      });
      return {
        access_token: accessToken,
      };
    } catch (e) {
      throw e;
    }
  }

  async signout(session_id: string): Promise<void> {
    try {
      const authEntity: Partial<Auth> = {
        cancel: true,
      };
      await this.update(session_id, authEntity);
    } catch (e) {
      throw e;
    }
  }

  async resetPassword(jwt: Account) {
    const generatePassword = Helper.generatePassword();
    const optionMailer: ResetPasswordDto = {
      to: [jwt.user.email],
      subject: '[Reset Password] Generate new password',
      template: 'reset-password',
      context: {
        username: jwt.username,
        reset_password: generatePassword,
      },
    };
    try {
      const mailer: AxiosResponse<Response<any>> = await firstValueFrom(
        this.httpService.post(`/mailer/reset-password`, optionMailer).pipe(
          catchError((error) => {
            console.log('error', JSON.stringify(error));
            throw `${error?.response?.data}`;
          }),
        ),
      );
    } catch (e) {
      throw new BadRequestException('Send mail reset password failed');
    }

    return await this.accountService.update(jwt.account_id, {
      password: await Helper.encryptPassword(generatePassword),
    });
  }
}
