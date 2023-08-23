import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { MessagePattern } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { HTTPExceptionFilter } from '@app/exception/http-exception.filter';
import { Response } from '@app/interceptor/response.interceptor';
import { DeleteResult } from 'typeorm';
@UseFilters(HTTPExceptionFilter)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<Response<User>> {
    const user = await this.usersService.create(createUserDto);
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
  findAll() {
    return this.usersService.findAll();
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
