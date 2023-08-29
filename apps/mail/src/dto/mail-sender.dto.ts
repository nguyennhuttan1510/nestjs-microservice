import { IsArray, IsObject, IsOptional, IsString } from 'class-validator';

export class SendMailDTO {
  @IsString()
  @IsOptional()
  from?: string;

  @IsArray()
  to: string[];

  @IsString()
  subject: string;

  @IsString()
  template: string;

  @IsObject()
  context: object;
}
