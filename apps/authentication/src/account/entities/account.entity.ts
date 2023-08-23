import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@authentication/users/entities/user.entity';
import { Staff } from '@authentication/staff/entities/staff.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  account_id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(() => User, (user) => user.account, {
    onDelete: 'CASCADE',
  })
  user: User;

  @OneToOne(() => Staff, (staff) => staff.account, {
    onDelete: 'CASCADE',
  })
  staff: Staff;
}
