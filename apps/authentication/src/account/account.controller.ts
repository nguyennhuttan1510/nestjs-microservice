import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

import { HTTPExceptionFilter } from '@app/exception/http-exception.filter';
import { Account } from '@authentication/account/entities/account.entity';
import {
  Response,
  ResponseInterceptor,
} from '@app/interceptor/response.interceptor';

@UseFilters(HTTPExceptionFilter)
@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @UseInterceptors(ResponseInterceptor)
  @Post()
  async create(
    @Body() createAccountDto: CreateAccountDto,
  ): Promise<Response<Account>> {
    const account = await this.accountService.create(createAccountDto);
    return {
      data: account,
      status: true,
      message: 'Create account success',
    };
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.accountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(+id, updateAccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.accountService.remove(+id);
  }
}
