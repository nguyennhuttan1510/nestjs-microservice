import {
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PersonalInformationModel } from '@authentication/model/personal-information.model';
import { Bank } from '@authentication/bank/entities/bank.entity';
import { Address } from '@authentication/address/entities/address.entity';
import { Account } from '@authentication/account/entities/account.entity';
import { Contract } from "@authentication/contract/entities/contract.entity";

@Entity('staff')
export class Staff extends PersonalInformationModel {
  @PrimaryGeneratedColumn()
  staff_id: number;

  @OneToOne(() => Bank, (bank) => bank.staff, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'bank_id' })
  bank: Bank;

  @OneToMany(() => Address, (address) => address.staff)
  addresses: Address[];

  @OneToOne(() => Account, (account) => account.staff, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @ManyToMany(() => Contract, (contract) => contract.staffs, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  contracts: Contract[];
}
