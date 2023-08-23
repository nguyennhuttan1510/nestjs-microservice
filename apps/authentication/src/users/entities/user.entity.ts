import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PersonalInformationModel } from '@authentication/model/personal-information.model';
import { Account } from '@authentication/account/entities/account.entity';
import { Bank } from '@authentication/bank/entities/bank.entity';
import { Address } from '@authentication/address/entities/address.entity';
import { Contract } from '@authentication/contract/entities/contract.entity';
import { Car } from '@authentication/car/entities/car.entity';

@Entity('users')
export class User extends PersonalInformationModel {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ nullable: true })
  fax: string;

  @OneToOne(() => Account, (account) => account.user, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @OneToOne(() => Bank, (bank) => bank.user, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Contract, (contract) => contract.user)
  contracts: Contract[];

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];
}
