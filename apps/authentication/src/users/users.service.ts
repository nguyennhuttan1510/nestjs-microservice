import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { AccountService } from '@authentication/account/account.service';
import { BankService } from '@authentication/bank/bank.service';
import { CarService } from '@authentication/car/car.service';
import { AddressService } from '@authentication/address/address.service';
import { CreateAccountDto } from '@authentication/account/dto/create-account.dto';
import { Account } from '@authentication/account/entities/account.entity';
import { Bank } from '@authentication/bank/entities/bank.entity';
import { CreateCarDto } from '@authentication/car/dto/create-car.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    readonly usersRepository: Repository<User>,
    readonly accountService: AccountService,
    readonly bankService: BankService,
    readonly carService: CarService,
    @Inject(forwardRef(() => AddressService))
    readonly addressService: AddressService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      //CREATE ACCOUNT
      const account: CreateAccountDto = {
        username: createUserDto.national_id,
        password: 'o0i9u8y7',
      };
      const accountEntity: Account = await this.accountService.create(account);

      //CREATE ADDRESS
      let addressEntityArr = [];
      for (let i = 0; i < createUserDto.address.length; i++) {
        const item = createUserDto.address[i];
        const address = await this.addressService.create(item);
        addressEntityArr = [...addressEntityArr, address];
      }

      //CREATE BANK
      const bankEntity: Bank = await this.bankService.create(
        createUserDto.bank,
      );

      //CREATE CAR
      let carEntityArr = [];
      for (let i = 0; i < createUserDto.cars.length; i++) {
        const item: CreateCarDto = createUserDto.cars[i];
        const car = await this.carService.create(item);
        carEntityArr = [...carEntityArr, car];
      }

      //CREATE USER
      const userEntity: DeepPartial<User> = {
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

        account: accountEntity,
        addresses: addressEntityArr,
        bank: bankEntity,
        cars: carEntityArr,
      };
      return await this.usersRepository.save(userEntity);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create user!', {
        cause: new Error(e),
      });
    }
  }

  findAll(): Promise<User[]> {
    try {
      return this.usersRepository.find();
    } catch (e) {
      throw new InternalServerErrorException('Failed to find users', {
        cause: new Error(e),
      });
    }
  }

  findOne(id: number): Promise<User> {
    try {
      return this.usersRepository.findOneBy({ user_id: id });
    } catch (e) {
      throw new InternalServerErrorException('Failed to find user', {
        cause: new Error(e),
      });
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const userEntity: DeepPartial<User> = {
        user_id: id,
        first_name: updateUserDto.first_name,
        last_name: updateUserDto.last_name,
        phone: updateUserDto.phone,
        country_of_birth: updateUserDto.country_of_birth,
        nationality: updateUserDto.nationality,
        is_multi_nationality: updateUserDto.is_multi_nationality,
        tax: updateUserDto.tax,
        fax: updateUserDto.fax,
        email: updateUserDto.email,
        national_id: updateUserDto.national_id,
        date_of_issue: updateUserDto.date_of_issue,
        place_of_issue: updateUserDto.place_of_issue,
        birthday: updateUserDto.birthday,
      };
      return await this.usersRepository.save(userEntity);
    } catch (e) {
      throw new InternalServerErrorException('Failed to updated user', {
        cause: new Error(e),
      });
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.usersRepository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException('Failed to delete user', {
        cause: new Error(e),
      });
    }
  }
}
