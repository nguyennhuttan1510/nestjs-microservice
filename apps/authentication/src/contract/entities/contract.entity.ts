import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Staff } from '@authentication/staff/entities/staff.entity';
import { User } from '@authentication/users/entities/user.entity';
import { Car } from '@authentication/car/entities/car.entity';

@Entity('contract')
export class Contract {
  @PrimaryGeneratedColumn()
  contract_id: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToMany(() => Staff, (staff) => staff.contracts, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinTable({
    name: 'staff_contract',
    joinColumn: { name: 'contract_id', referencedColumnName: 'contract_id' },
    inverseJoinColumn: {
      name: 'staff_id',
      referencedColumnName: 'staff_id',
    },
  })
  staffs: Staff[];

  @ManyToOne(() => User, (user) => user.contracts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToOne(() => Car)
  @JoinColumn({ name: 'car_id' })
  object_insurance: Car;

}
