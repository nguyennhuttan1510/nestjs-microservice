import { forwardRef, Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '@authentication/account/entities/account.entity';
import { AuthModule } from '@authentication/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    HttpModule.register({
      baseURL: process.env.ENDPOINT_MAILER,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
    forwardRef(() => AuthModule),
  ],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
