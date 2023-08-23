import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Staff } from '@authentication/staff/entities/staff.entity';
import { User } from '@authentication/users/entities/user.entity';

@Entity('bank')
export class Bank {
  @PrimaryGeneratedColumn()
  bank_id: number;

  @Column()
  bank_account: string;

  @Column()
  bank_branch: string;

  @Column()
  owner: string;

  @Column()
  bank_name: string;

  @OneToOne(() => Staff, (staff) => staff.bank, {
    onDelete: 'CASCADE',
  })
  staff: Staff;

  @OneToOne(() => User, (user) => user.bank, {
    onDelete: 'CASCADE',
  })
  user: User;
}
