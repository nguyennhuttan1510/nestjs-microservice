import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { Auth } from '@authentication/auth/entities/auth.entity';
import { User } from '@authentication/users/entities/user.entity';
import { Account } from '@authentication/account/entities/account.entity';
import { AccountService } from '@authentication/account/account.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@authentication/users/users.service';
import Helper from '@authentication/utils/helper';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
    private readonly accountService: AccountService,
    private readonly userService: UsersService,
    private jwtService: JwtService,
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

      //CHECK TOKEN IS WORKING AND CANCEL
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
}
