import { IsArray, IsObject, IsString } from 'class-validator';

export class SendMailDTODto {
  @IsString()
  from?: string;

  @IsArray()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  template: string;

  @IsObject()
  context: object;
}
