import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import {
  ChangePasswordAccountDto,
  UpdateAccountDto,
} from './dto/update-account.dto';

import { Account } from '@authentication/account/entities/account.entity';
import { Response } from '@app/interceptor/response.interceptor';
import { AllowFirstAccess } from '@authentication/auth/decorators/allow_first_access.decorators';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

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

  @AllowFirstAccess()
  @Patch('change-password')
  async changePassword(
    @Headers('jwt') jwt: Account & { session_id: string },
    @Body() passwordUpdate: ChangePasswordAccountDto,
  ): Promise<Response<any>> {
    await this.accountService.changePassword(jwt, passwordUpdate);
    return {
      data: null,
      status: true,
      message: 'Change password success',
    };
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
