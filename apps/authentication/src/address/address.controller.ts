import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Response } from '@app/interceptor/response.interceptor';
import { Address } from './entities/address.entity';
import { DeleteResult } from 'typeorm';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async create(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<Response<Address>> {
    const address = await this.addressService.create(createAddressDto);
    return {
      data: address,
      status: true,
      message: 'Create address success',
    };
  }

  @Get()
  async findAll(): Promise<Response<Address[]>> {
    const address = await this.addressService.findAll();
    return {
      data: address,
      status: true,
      message: 'Find address success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<Address>> {
    const address = await this.addressService.findOne(+id);
    return {
      data: address,
      status: true,
      message: 'Find address success',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<Response<Address>> {
    const address = await this.addressService.update(+id, updateAddressDto);
    return {
      data: address,
      status: true,
      message: 'Update address success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response<DeleteResult>> {
    const result = await this.addressService.remove(+id);
    return {
      data: result,
      status: true,
      message: 'Delete address success',
    };
  }
}
