import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@authentication/users/entities/user.entity';
import { Staff } from '@authentication/staff/entities/staff.entity';
import { Auth } from '@authentication/auth/entities/auth.entity';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  account_id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'boolean',
    default: true,
  })
  is_first_access: boolean;

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

  @OneToMany(() => Auth, (auth) => auth.account)
  auths: Auth[];
}
