import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Account } from '@authentication/account/entities/account.entity';
import { Bank } from './bank/entities/bank.entity';
import { Car } from './car/entities/car.entity';
import { Address } from './address/entities/address.entity';
import { Staff } from './staff/entities/staff.entity';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { BankModule } from './bank/bank.module';
import { AddressModule } from './address/address.module';
import { StaffModule } from './staff/staff.module';
import { CarModule } from './car/car.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { Auth } from '@authentication/auth/entities/auth.entity';
import Helper from './utils/helper';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { join } from 'path';
import { LoggerMiddleware } from 'middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          dirname: join(__dirname, '..', '..', '..', 'log/debug/'), //path to where save loggin result
          filename: 'debug.log', //name of file where will be saved logging result
          level: 'debug',
        }),
      ],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DATABASE || Helper.getEn0Ipv4().address,
      port: parseInt(process.env.PORT_DATABASE),
      username: process.env.USER_DATABASE,
      password: process.env.PASSWORD_DATABASE,
      database: 'authentication',
      entities: [
        User,
        Account,
        Bank,
        Car,
        // Contract,
        Address,
        Staff,
        Auth,
        // StaffContractEntity,
      ],
      synchronize: true,
      autoLoadEntities: true,
      // connectTimeout: 60000,
    }),
    UsersModule,
    AccountModule,
    BankModule,
    CarModule,
    // ContractModule,
    AddressModule,
    StaffModule,
    AuthModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
