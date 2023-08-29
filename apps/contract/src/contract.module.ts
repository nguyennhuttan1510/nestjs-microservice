import { Module } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { TypeOrmModule } from '@nestjs/typeorm';
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
      baseURL: process.env.ENDPOINT_AUTHENTICATION,
      headers: {
        'Content-Type': 'application/json',
      },
    }),
  ],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
