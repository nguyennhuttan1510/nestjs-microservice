import { TYPE_ADDRESS } from '../entities/address.entity';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsOptional()
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsNumber()
  staff_id: number;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @IsString()
  ward: string;

  @IsIn([TYPE_ADDRESS.PERMANENT, TYPE_ADDRESS.HOUSEHOLD, TYPE_ADDRESS.OTHER])
  type_address: TYPE_ADDRESS;
}
