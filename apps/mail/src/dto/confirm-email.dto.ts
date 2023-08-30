import { SendMailDTO } from './mail-sender.dto';
import { IsString } from 'class-validator';

export class ConfirmEmailDto extends SendMailDTO {
  context: ConfirmEmail;
}

export class ConfirmEmail {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  link: string;
}
