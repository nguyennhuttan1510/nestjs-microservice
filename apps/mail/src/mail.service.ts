import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ISendMailOptions } from '@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface';

export interface SendMailerOption<T = ISendMailOptions['context']>
  extends ISendMailOptions {
  to: ISendMailOptions['to'];
  from: ISendMailOptions['from'];
  subject: ISendMailOptions['subject'];
  template: ISendMailOptions['template'];
  context: T;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  sendMail(option: SendMailerOption) {
    return this.mailerService
      .sendMail(option)
      .then((value) => {
        return value?.accepted;
      })
      .catch((e) => {
        console.log('sendMail', e);
        throw new InternalServerErrorException('Send mail failed');
      });
  }
}
