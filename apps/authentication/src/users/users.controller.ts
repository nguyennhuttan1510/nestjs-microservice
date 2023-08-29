import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { Response } from '@app/interceptor/response.interceptor';
import { DeleteResult } from 'typeorm';
import { AxiosError, AxiosResponse } from 'axios/index';
import { Staff } from '@authentication/staff/entities/staff.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { SendMailDTODto } from '../../../mail/src/dto/sendMailDTO.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    const user = await this.usersService.create(createUserDto);
    const payload: SendMailDTODto = {
      to: 'tannn@grooo.vn',
      subject: '[Confirm] Verify Account',
      template: 'confirm_verify_email',
      context: {
        name: 'Nguyen Nhut Tan',
      },
    };
    const mailer: AxiosResponse<Response<any>> = await firstValueFrom(
      this.httpService.post(`/mailer/`, payload).pipe(
        catchError((error: AxiosError) => {
          throw `${error.response.data}`;
        }),
      ),
    );
    console.log('mailer', mailer);
    return {
      data: user,
      status: true,
      message: 'Create user success',
    };
  }

  // @MessagePattern({ cmd: 'get_users' })
  // findAll() {
  //   return this.usersService.findAll();
  // }

  @Get()
  @MessagePattern({ cmd: 'get_users' })
  async findAll(): Promise<Response<User[]>> {
    const users: User[] = await this.usersService.findAll();
    return {
      data: users,
      status: true,
      message: 'Get users success',
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
