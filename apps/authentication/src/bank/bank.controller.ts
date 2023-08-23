import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Response } from '@app/interceptor/response.interceptor';
import { Bank } from './entities/bank.entity';
import { DeleteResult } from 'typeorm';

@Controller('bank')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  async create(@Body() createBankDto: CreateBankDto): Promise<Response<Bank>> {
    const bank = await this.bankService.create(createBankDto);
    return {
      data: bank,
      status: true,
      message: 'Create bank success',
    };
  }

  @Get()
  async findAll(): Promise<Response<Bank[]>> {
    const banks = await this.bankService.findAll();
    return {
      data: banks,
      status: true,
      message: 'Find bank success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<Bank>> {
    const bank = await this.bankService.findOne(+id);
    return {
      data: bank,
      status: true,
      message: 'Find bank success',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBankDto: UpdateBankDto,
  ): Promise<Response<Bank>> {
    const bank = await this.bankService.update(+id, updateBankDto);
    return {
      data: bank,
      status: true,
      message: 'Update bank success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response<DeleteResult>> {
    const result = await this.bankService.remove(+id);
    return {
      data: result,
      status: true,
      message: 'Delete bank success',
    };
  }
}
