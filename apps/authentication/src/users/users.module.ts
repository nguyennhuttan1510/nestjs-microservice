import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AccountModule } from '../account/account.module';
import { AddressModule } from '../address/address.module';
import { BankModule } from '../bank/bank.module';
import { CarModule } from '../car/car.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AccountModule,
    BankModule,
    CarModule,
    forwardRef(() => AddressModule),
    ConfigModule.forRoot(),
    HttpModule.register({
      baseURL: process.env.ENDPOINT_MAILER,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
