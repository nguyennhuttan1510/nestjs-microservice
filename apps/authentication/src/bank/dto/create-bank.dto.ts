import { IsString, Length } from 'class-validator';

export class CreateBankDto {
  @IsString()
  bank_branch: string;

  @Length(0, 50)
  @IsString()
  bank_name: string;

  @IsString()
  bank_account: string;

  @Length(0, 90)
  @IsString()
  owner: string;
}
