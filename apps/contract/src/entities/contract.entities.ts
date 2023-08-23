import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DateTimeModel } from '@authentication/common/entities/datetime.model';

@Entity('contract')
export class ContractEntity extends DateTimeModel {
  @PrimaryGeneratedColumn()
  contract_id: number;

  @Column()
  user_id: number;

  @Column()
  object_insured_id: number;

  @Column()
  staff_id: number;

  @Column()
  staff_manager_id: number;
}
