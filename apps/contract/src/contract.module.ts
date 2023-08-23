import { Module } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@authentication/users/entities/user.entity';
import { Account } from '@authentication/account/entities/account.entity';
import { Bank } from '@authentication/bank/entities/bank.entity';
import { Car } from '@authentication/car/entities/car.entity';
import { Contract } from '@authentication/contract/entities/contract.entity';
import { Address } from '@authentication/address/entities/address.entity';
import { Staff } from '@authentication/staff/entities/staff.entity';
import { StaffContractEntity } from '@authentication/enittys/staff-contract.entity';
import { ContractEntity } from './entities/contract.entities';
import { HttpModule } from '@nestjs/axios';
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
      database: 'insurance',
      entities: [ContractEntity],
      synchronize: true,
      autoLoadEntities: true,
      // connectTimeout: 60000,
    }),
    TypeOrmModule.forFeature([ContractEntity]),
    HttpModule.register({
      baseURL: 'http://localhost:4000',
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
