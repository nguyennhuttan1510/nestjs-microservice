import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Account } from '@authentication/account/entities/account.entity';
import { Bank } from './bank/entities/bank.entity';
import { Car } from './car/entities/car.entity';
import { Contract } from './contract/entities/contract.entity';
import { Address } from './address/entities/address.entity';
import { Staff } from './staff/entities/staff.entity';
import { StaffContractEntity } from './enittys/staff-contract.entity';
import { UsersModule } from './users/users.module';
import { AccountModule } from './account/account.module';
import { BankModule } from './bank/bank.module';
import { ContractModule } from './contract/contract.module';
import { AddressModule } from './address/address.module';
import { StaffModule } from './staff/staff.module';
import { CarModule } from './car/car.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.HOST_DATABASE,
      port: parseInt(process.env.PORT_DATABASE),
      username: process.env.USER_DATABASE,
      password: process.env.PASSWORD_DATABASE,
      database: 'authentication',
      entities: [
        User,
        Account,
        Bank,
        Car,
        Contract,
        Address,
        Staff,
        StaffContractEntity,
      ],
      synchronize: true,
      autoLoadEntities: true,
      // connectTimeout: 60000,
    }),
    UsersModule,
    AccountModule,
    BankModule,
    CarModule,
    ContractModule,
    AddressModule,
    StaffModule,
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
