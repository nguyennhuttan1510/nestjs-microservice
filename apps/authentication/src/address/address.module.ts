import { forwardRef, Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { UsersModule } from '@authentication/users/users.module';
import { StaffModule } from '@authentication/staff/staff.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    forwardRef(() => UsersModule),
    forwardRef(() => StaffModule),
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressModule {}
