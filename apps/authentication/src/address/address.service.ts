import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { UsersService } from '@authentication/users/users.service';
import { StaffService } from '@authentication/staff/staff.service';
import { User } from '@authentication/users/entities/user.entity';
import { Staff } from '@authentication/staff/entities/staff.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    readonly addressRepository: Repository<Address>,
    @Inject(forwardRef(() => UsersService))
    readonly usersService: UsersService,
    @Inject(forwardRef(() => StaffService))
    readonly staffService: StaffService,
  ) {}
  async create(createAddressDto: CreateAddressDto): Promise<Address> {
    if (createAddressDto.user_id && createAddressDto.staff_id)
      throw new BadRequestException('Only one user_id or staff_id');
    try {
      let addressEntity: DeepPartial<Address> = {
        type_address: createAddressDto.type_address,
        city: createAddressDto.city,
        ward: createAddressDto.ward,
        district: createAddressDto.district,
      };
      //SWITCH IS USER OR IS STAFF
      //IS USER
      if (createAddressDto.user_id) {
        const user: User = await this.usersService.findOne(
          createAddressDto.user_id,
        );
        addressEntity = {
          ...addressEntity,
          user,
        };
      }
      //IS USER
      if (createAddressDto.staff_id) {
        const staff: Staff = await this.staffService.findOne(
          createAddressDto.staff_id,
        );
        addressEntity = {
          ...addressEntity,
          staff,
        };
      }
      const address = this.addressRepository.create(addressEntity);
      return await this.addressRepository.save(address);
    } catch (e) {
      throw new InternalServerErrorException('Failed to create address', {
        cause: new Error(e),
      });
    }
  }

  async findAll(): Promise<Address[]> {
    try {
      return await this.addressRepository.find();
    } catch (e) {
      throw new InternalServerErrorException('Failed to find all address', {
        cause: new Error(e),
      });
    }
  }

  async findOne(id: number): Promise<Address> {
    try {
      return await this.addressRepository.findOneBy({
        address_id: id,
      });
    } catch (e) {
      throw new InternalServerErrorException('Failed to find address', {
        cause: new Error(e),
      });
    }
  }

  async update(
    id: number,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    try {
      const address: DeepPartial<Address> = {
        address_id: id,
        type_address: updateAddressDto.type_address,
        city: updateAddressDto.city,
        ward: updateAddressDto.ward,
        district: updateAddressDto.district,
      };

      return this.addressRepository.save(address);
    } catch (e) {
      throw new InternalServerErrorException('Failed to update address', {
        cause: new Error(e),
      });
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.addressRepository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException('Failed to delete address', {
        cause: new Error(e),
      });
    }
  }
}
