import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bank } from './entities/bank.entity';
import { DeleteResult, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank) private bankRepository: Repository<Bank>,
  ) {}
  async create(createBankDto: CreateBankDto): Promise<Bank> {
    try {
      const bank: DeepPartial<Bank> = {
        bank_account: createBankDto.bank_account,
        bank_branch: createBankDto.bank_branch,
        bank_name: createBankDto.bank_name,
        owner: createBankDto.owner,
      };
      return await this.bankRepository.save(bank);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create bank', {
        cause: new Error(e),
      });
    }
  }

  async findAll(): Promise<Bank[]> {
    try {
      return await this.bankRepository.find();
    } catch (e) {
      throw new InternalServerErrorException('Failed to find banks', {
        cause: new Error(e),
      });
    }
  }

  async findOne(id: number): Promise<Bank> {
    try {
      return await this.bankRepository.findOneBy({ bank_id: id });
    } catch (e) {
      throw new InternalServerErrorException('Failed to find banks', {
        cause: new Error(e),
      });
    }
  }

  async update(id: number, updateBankDto: UpdateBankDto): Promise<Bank> {
    try {
      const bank: DeepPartial<Bank> = {
        bank_id: id,
        bank_account: updateBankDto.bank_account,
        bank_branch: updateBankDto.bank_branch,
        bank_name: updateBankDto.bank_name,
        owner: updateBankDto.owner,
      };
      return await this.bankRepository.save(bank);
    } catch (e) {
      throw new InternalServerErrorException('Failed to find banks', {
        cause: new Error(e),
      });
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.bankRepository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException('Failed to find banks', {
        cause: new Error(e),
      });
    }
  }
}
