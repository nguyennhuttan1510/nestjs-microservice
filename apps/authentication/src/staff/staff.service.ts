import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { Repository } from 'typeorm';
import { AddressService } from '@authentication/address/address.service';
import { AccountService } from '@authentication/account/account.service';
import { BankService } from '@authentication/bank/bank.service';
import { CreateAccountDto } from '@authentication/account/dto/create-account.dto';
import { Bank } from '@authentication/bank/entities/bank.entity';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff) private staffRepository: Repository<Staff>,
    @Inject(forwardRef(() => AddressService))
    readonly addressService: AddressService,
    private accountService: AccountService,
    private bankService: BankService,
  ) {}
  async create(createStaffDto: CreateStaffDto) {
    try {
      //CREATE ACCOUNT
      const account: CreateAccountDto = {
        username: createStaffDto.national_id,
        password: 'o0i9u8y7_staff',
      };
      const accountEntity = await this.accountService.create(account);

      //CREATE ADDRESS
      let addressArr = [];
      for (let i = 0; i < createStaffDto.address.length; i++) {
        const item = createStaffDto.address[i];
        const address = await this.addressService.create(item);
        addressArr = [...addressArr, address];
      }

      //CREATE BANK
      const bankEntity: Bank = await this.bankService.create(
        createStaffDto.bank,
      );

      //CREATE STAFF
      const userEntity: DeepPartial<Staff> = {
        first_name: createStaffDto.first_name,
        last_name: createStaffDto.last_name,
        phone: createStaffDto.phone,
        country_of_birth: createStaffDto.country_of_birth,
        nationality: createStaffDto.nationality,
        is_multi_nationality: createStaffDto.is_multi_nationality,
        tax: createStaffDto.tax,
        email: createStaffDto.email,
        national_id: createStaffDto.national_id,
        date_of_issue: createStaffDto.date_of_issue,
        place_of_issue: createStaffDto.place_of_issue,
        birthday: createStaffDto.birthday,

        account: accountEntity,
        addresses: addressArr,
        bank: bankEntity,
      };
      return await this.staffRepository.save(userEntity);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create staff!', {
        cause: new Error(e),
      });
    }
  }

  async findAll() {
    try {
      return await this.staffRepository.find();
    } catch (e) {
      throw new InternalServerErrorException('Failed to find staffs', {
        cause: new Error(e),
      });
    }
  }

  async findOne(id: number) {
    try {
      return await this.staffRepository.findOneBy({
        staff_id: id,
      });
    } catch (e) {
      throw new InternalServerErrorException('Failed to find staff!', {
        cause: new Error(e),
      });
    }
  }

  async update(id: number, updateStaffDto: UpdateStaffDto) {
    try {
      const staff: DeepPartial<Staff> = {
        first_name: updateStaffDto.first_name,
        last_name: updateStaffDto.last_name,
        phone: updateStaffDto.phone,
        country_of_birth: updateStaffDto.country_of_birth,
        nationality: updateStaffDto.nationality,
        is_multi_nationality: updateStaffDto.is_multi_nationality,
        tax: updateStaffDto.tax,
        email: updateStaffDto.email,
        national_id: updateStaffDto.national_id,
        date_of_issue: updateStaffDto.date_of_issue,
        place_of_issue: updateStaffDto.place_of_issue,
        birthday: updateStaffDto.birthday,
      };
      return await this.staffRepository.save(staff);
    } catch (e) {
      throw new InternalServerErrorException('Failed to update staff', {
        cause: new Error(e),
      });
    }
  }

  async remove(id: number) {
    try {
      return await this.staffRepository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException('Failed to delete staff', {
        cause: new Error(e),
      });
    }
  }
}
