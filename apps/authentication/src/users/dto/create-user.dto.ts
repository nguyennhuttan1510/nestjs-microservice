import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateAddressDto } from '@authentication/address/dto/create-address.dto';
import { CreateBankDto } from '@authentication/bank/dto/create-bank.dto';
import { CreateCarDto } from '@authentication/car/dto/create-car.dto';
import { PersonalInformationDto } from '@authentication/common/dto/personal-information.dto';

export class CreateUserDto extends PersonalInformationDto {
  @IsOptional()
  @IsString()
  fax: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  address: CreateAddressDto[];

  @ValidateNested()
  @Type(() => CreateBankDto)
  bank: CreateBankDto;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCarDto)
  cars: CreateCarDto[];
}
