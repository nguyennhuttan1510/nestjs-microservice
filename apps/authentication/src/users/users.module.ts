import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AccountModule } from '../account/account.module';
import { AddressModule } from '../address/address.module';
import { BankModule } from '../bank/bank.module';
import { CarModule } from '../car/car.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AccountModule,
    BankModule,
    CarModule,
    forwardRef(() => AddressModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
