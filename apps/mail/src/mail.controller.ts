import { Body, Controller, Get, Post } from "@nestjs/common";
import { MailService, SendMailerOption } from './mail.service';
import { SendMailDTODto } from './dto/sendMailDTO.dto';

@Controller()
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('mailer')
  async sendMail(@Body() bodyMail: SendMailDTODto) {
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
