import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import * as process from 'process';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.HOST_MAILER,
        secure: false,
        auth: {
          user: process.env.GOOGLE_USERNAME_APPLICATION,
          pass: process.env.GOOGLE_PASSWORD_APPLICATION,
        },
      },
      // defaults: {
      //   from: '"No Reply" <noreply@example.com>',
      // },
      template: {
        dir: process.cwd() + '/apps/mail/src/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [MailController],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
