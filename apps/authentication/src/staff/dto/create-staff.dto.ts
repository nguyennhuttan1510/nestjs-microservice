import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { PersonalInformationDto } from '@authentication/common/dto/personal-information.dto';
import { CreateAddressDto } from '@authentication/address/dto/create-address.dto';
import { CreateBankDto } from '@authentication/bank/dto/create-bank.dto';

export class CreateStaffDto extends PersonalInformationDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  address: CreateAddressDto[];

  @ValidateNested()
  @Type(() => CreateBankDto)
  bank: CreateBankDto;
}
