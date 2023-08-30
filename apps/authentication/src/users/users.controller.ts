import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Response } from '@app/interceptor/response.interceptor';
import { DeleteResult } from 'typeorm';
import { AxiosResponse } from 'axios/index';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Public } from '@authentication/auth/decorators/public.decarators';
import { ConfirmEmailDto } from '../../../mail/src/dto/confirm-email.dto';

export interface ExtendTypeUser {
  passwordGenerate: string;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  @Public()
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto & ExtendTypeUser,
  ): Promise<Response<User>> {
    const randomCodeVerify = Math.floor(Math.random() * 100);
    const url = `${process.env.ENDPOINT_AUTHENTICATION}/users/confirm?national_id=${createUserDto.national_id}&code=${randomCodeVerify}`;

    const generatePassword = Math.random().toString(36).slice(-8);

    createUserDto = {
      ...createUserDto,
      code_verify: String(randomCodeVerify),
      passwordGenerate: generatePassword,
    };
    const user = await this.usersService.create(createUserDto);
    if (!user) return;
    console.log('url', url);
    const payload: ConfirmEmailDto = {
      to: [createUserDto.email],
      subject: '[Confirm] Verify Account',
      template: 'confirm_verify_email',
      context: {
        name: `${user.last_name} ${user.first_name}`,
        username: user.account.username,
        password: generatePassword,
        link: url,
      },
    };
    try {
      const mailer: AxiosResponse<Response<any>> = await firstValueFrom(
        this.httpService.post(`/mailer/confirm-verify-email`, payload).pipe(
          catchError((error) => {
            console.log('error', JSON.stringify(error));
            throw `${error?.response?.data}`;
          }),
        ),
      );
    } catch (error) {
      throw new BadRequestException('Send Mail confirm failed');
    }

    return {
      data: user,
      status: true,
      message: 'Create user success',
    };
  }

  // @Get()
  // @MessagePattern({ cmd: 'get_users' })
  // async findAll(): Promise<Response<User[]>> {
  //   const users: User[] = await this.usersService.findAll();
  //   return {
  //     data: users,
  //     status: true,
  //     message: 'Get users success',
  //   };
  // }

  @Public()
  @Get('confirm')
  async confirmEmail(
    @Query() queryParams: { national_id: string; code: string },
  ) {
    console.log('queryParams', queryParams);
    await this.usersService.confirmEmail({
      national_id: queryParams.national_id,
      code_verify: queryParams.code,
    });
    return {
      data: null,
      status: true,
      message: `Verify success`,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<User>> {
    const user = await this.usersService.findOne(+id);
    return {
      data: user,
      status: true,
      message: 'Get user success',
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);
    return {
      data: user,
      status: true,
      message: 'Update user success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response<DeleteResult>> {
    const user = await this.usersService.remove(+id);
    return {
      data: user,
      status: true,
      message: `Deleted user ${id}`,
    };
  }
}
