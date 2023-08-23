import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { UsersModule } from '@authentication/users/users.module';
import { StaffModule } from '@authentication/staff/staff.module';
import { CarModule } from '@authentication/car/car.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    UsersModule,
    StaffModule,
    CarModule,
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
