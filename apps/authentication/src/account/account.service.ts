import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  ChangePasswordAccountDto,
  UpdateAccountDto,
} from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@authentication/account/entities/account.entity';
import { FindOneOptions, Repository, UpdateResult } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import Helper from '@authentication/utils/helper';
import { AuthService } from '@authentication/auth/auth.service';
import { AddressService } from '@authentication/address/address.service';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @Inject(forwardRef(() => AuthService))
    readonly authService: AuthService,
  ) {}

  private optionFindAccount(id: number): FindOneOptions<Account> {
    return {
      where: {
        account_id: id,
      },
    };
  }

  async create(createAccountDto: CreateAccountDto) {
    const { isExisted } = await this.checkExistAccount(
      createAccountDto.username,
    );
    if (isExisted) throw new BadRequestException('Username is existed');
    try {
      const hashPassword = await Helper.encryptPassword(
        createAccountDto.password,
      );
      const accountEntity: DeepPartial<Account> = {
        username: createAccountDto.username,
        password: hashPassword,
      };

      const account: Account = this.accountRepository.create(accountEntity);
      return this.accountRepository.save(account);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create account!', {
        cause: new Error(e),
      });
    }
  }

  async findAll() {
    try {
      return await this.accountRepository.find();
    } catch (e) {
      throw new InternalServerErrorException('Failed to find account!', {
        cause: new Error(e),
      });
    }
  }

  async findOne(
    id?: number,
    option: FindOneOptions = this.optionFindAccount(id),
  ) {
    try {
      return await this.accountRepository.findOne(option);
    } catch (e) {
      throw e;
    }
  }

  update(id: number, account: Partial<Account>): Promise<UpdateResult> {
    return this.accountRepository.update(id, account);
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }

  async checkExistAccount(
    username: Account['username'],
  ): Promise<{ account: Account; isExisted: boolean }> {
    const optionsFindAccount: FindOneOptions<Account> = {
      where: {
        username: username,
      },
      relations: {
        user: true,
      },
    };
    try {
      const account: Account = await this.findOne(null, optionsFindAccount);
      return {
        account: account,
        isExisted: account !== null,
      };
    } catch (e) {
      throw e;
    }
  }

  async changePassword(
    account: Partial<Account> & { session_id: string },
    passwordChange: ChangePasswordAccountDto,
  ): Promise<UpdateResult> {
    if (passwordChange.newPassword !== passwordChange.confirmPassword)
      throw new BadRequestException('New password not match');

    try {
      const { account: accountEntity } = await this.checkExistAccount(
        account.username,
      );

      const isMatchPassword = await Helper.comparePassword(
        passwordChange.oldPassword,
        accountEntity.password,
      );
      if (!isMatchPassword) {
        throw new BadRequestException('Old password invalid');
      }

      await this.authService.signout(account.session_id);

      return this.accountRepository.update(accountEntity.account_id, {
        password: await Helper.encryptPassword(passwordChange.newPassword),
        is_first_access: false,
      });
    } catch (e) {
      throw e;
    }
  }
}
