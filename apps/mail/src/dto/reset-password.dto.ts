import { IsString } from 'class-validator';
import { SendMailDTO } from './mail-sender.dto';

export class ResetPasswordDto extends SendMailDTO {
  context: ResetPasswordContext;
}

export class ResetPasswordContext {
  @IsString()
  username: string;

  @IsString()
  reset_password: string;
}
