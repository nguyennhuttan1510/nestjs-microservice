import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto';
import { IsString } from 'class-validator';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}
export class ChangePasswordAccountDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;

  @IsString()
  confirmPassword: string;
}
