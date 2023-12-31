import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService, SendMailerOption } from './mail.service';
import { SendMailDTO } from './dto/mail-sender.dto';
import { ConfirmEmailDto } from './dto/confirm-email.dto';

@Controller('mailer')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('confirm-verify-email')
  async sendMailConfirm(@Body() bodyMail: ConfirmEmailDto) {
    const option: SendMailerOption = {
      from: bodyMail.from || process.env.GOOGLE_USERNAME_APPLICATION,
      to: bodyMail.to,
      subject: bodyMail.subject,
      template: bodyMail.template,
      context: bodyMail.context,
    };
    const result = await this.mailService.sendMail(option);
    return {
      data: result,
    };
  }

  @Post('reset-password')
  async sendMailResetPassword(@Body() bodyMail: SendMailDTO) {
    const option: SendMailerOption = {
      from: bodyMail.from || process.env.GOOGLE_USERNAME_APPLICATION,
      to: bodyMail.to,
      subject: bodyMail.subject,
      template: bodyMail.template,
      context: bodyMail.context,
    };
    const result = await this.mailService.sendMail(option);
    return {
      data: result,
    };
  }
}
