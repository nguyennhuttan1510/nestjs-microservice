import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Response } from '@app/interceptor';
import { Staff } from '@authentication/staff/entities/staff.entity';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { User } from '@api/user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly httpService: HttpService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const payload: CreateUserDto = {
        first_name: createUserDto.first_name,
        last_name: createUserDto.last_name,
        phone: createUserDto.phone,
        country_of_birth: createUserDto.country_of_birth,
        nationality: createUserDto.nationality,
        is_multi_nationality: createUserDto.is_multi_nationality,
        tax: createUserDto.tax,
        fax: createUserDto.fax,
        email: createUserDto.email,
        national_id: createUserDto.national_id,
        date_of_issue: createUserDto.date_of_issue,
        place_of_issue: createUserDto.place_of_issue,
        birthday: createUserDto.birthday,

        cars: createUserDto.cars,
        bank: createUserDto.bank,
        address: createUserDto.address,
      };
      const user: AxiosResponse<Response<User>> = await firstValueFrom(
        this.httpService.post(`/users`, payload).pipe(
          catchError((error: AxiosError) => {
            throw `${error.response.data}`;
          }),
        ),
      );
      return user.data;
    } catch (e) {
      throw e;
    }
  }

  async findAll() {
    try {
      const users: AxiosResponse<Response<User>> = await firstValueFrom(
        this.httpService.get(`/users`).pipe(
          catchError((error: AxiosError) => {
            throw `${error.response.data}`;
          }),
        ),
      );
      return users.data;
    } catch (e) {
      throw e;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
