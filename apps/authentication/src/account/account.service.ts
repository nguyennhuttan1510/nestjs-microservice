import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@authentication/account/entities/account.entity';
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
  ) {}
  create(createAccountDto: CreateAccountDto) {
    try {
      const accountEntity: DeepPartial<Account> = {
        username: createAccountDto.username,
        password: createAccountDto.password,
      };
      const account = this.accountRepository.create(accountEntity);
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

  findOne(id: number) {
    return `This action returns a #${id} account`;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
