import { IsArray, IsIn, IsObject, IsOptional, IsString } from 'class-validator';

export class SendMailDTO {
  @IsString()
  @IsOptional()
  from?: string;

  @IsArray()
  to: string[];

  @IsString()
  subject: string;

  @IsString()
  @IsIn(['reset-password', 'confirm_verify_email'])
  template: string;

  @IsObject()
  context: object;
}
