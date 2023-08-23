import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@authentication/users/entities/user.entity';
import { Staff } from '@authentication/staff/entities/staff.entity';

export enum TYPE_ADDRESS {
  PERMANENT = 'PERMANENT',
  HOUSEHOLD = 'HOUSEHOLD',
  OTHER = 'OTHER',
}

@Entity('address')
export class Address {
  @PrimaryGeneratedColumn()
  address_id: number;

  @Column()
  city: string;

  @Column()
  district: string;

  @Column()
  ward: string;

  @Column({
    type: 'enum',
    enum: TYPE_ADDRESS,
    default: TYPE_ADDRESS.PERMANENT,
    nullable: false,
  })
  type_address: TYPE_ADDRESS;

  @ManyToOne(() => User, (user) => user.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Staff, (staff) => staff.addresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;
}
