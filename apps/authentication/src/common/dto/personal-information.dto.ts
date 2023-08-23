import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export abstract class PersonalInformationDto {
  @Length(0, 30)
  @IsString()
  first_name: string;

  @Length(0, 30)
  @IsString()
  last_name: string;

  @IsPhoneNumber('VI')
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  country_of_birth: string;

  @IsOptional()
  @IsString()
  nationality: string;

  @IsOptional()
  @IsBoolean()
  is_multi_nationality: string;

  @IsOptional()
  @Length(13, 13)
  tax: string;

  @IsEmail()
  email: string;

  @Matches(/^\d{9}$|^\d{12}$/g, {
    message: 'Vui lòng nhập đúng format',
  })
  @IsString()
  national_id: string;

  @IsOptional()
  @IsDateString()
  date_of_issue: string;

  @IsOptional()
  @IsString()
  place_of_issue: string;

  @IsOptional()
  @IsDateString()
  birthday: Date;
}
