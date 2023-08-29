import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@authentication/account/entities/account.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import Helper from '@authentication/utils/helper';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}

  private optionFindAccount(id: number): FindOneOptions<Account> {
    return {
      where: {
        account_id: id,
      },
    };
  }

  async create(createAccountDto: CreateAccountDto) {
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

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
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
}
