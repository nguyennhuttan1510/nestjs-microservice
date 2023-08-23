import { forwardRef, Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Staff } from './entities/staff.entity';
import { AccountModule } from '@authentication/account/account.module';
import { BankModule } from '@authentication/bank/bank.module';
import { AddressModule } from '@authentication/address/address.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Staff]),
    AccountModule,
    BankModule,
    forwardRef(() => AddressModule),
  ],
  controllers: [StaffController],
  providers: [StaffService],
  exports: [StaffService],
})
export class StaffModule {}
