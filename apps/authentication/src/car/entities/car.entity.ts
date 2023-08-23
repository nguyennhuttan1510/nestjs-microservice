import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '@authentication/users/entities/user.entity';

export enum MADE_IN {
  DOMESTIC = 'DOMESTIC',
  FOREIGN = 'FOREIGN',
}

export enum PURPOSE_USAGE {
  USAGE = 'USAGE',
  OTHER = 'OTHER',
}

@Entity('car')
export class Car {
  @PrimaryGeneratedColumn()
  car_id: number;

  @Column()
  plate_no: string;

  @Column()
  chassis_no: string;

  @Column()
  engine_no: string;

  @Column()
  mark_and_model: string;

  @Column()
  seats: number;

  @Column()
  year_of_manufacture: string;

  @Column()
  origin: string;

  @Column({
    type: 'enum',
    enum: MADE_IN,
    default: MADE_IN.DOMESTIC,
    nullable: false,
  })
  made_in: MADE_IN;

  @Column({
    type: 'enum',
    enum: PURPOSE_USAGE,
    default: PURPOSE_USAGE.USAGE,
    nullable: false,
  })
  purpose_of_usage: string;

  @Column()
  value_of: number;

  // @OneToOne(() => Contract)
  // @JoinColumn({ name: 'contract_id' })
  // contract: Contract;

  @ManyToOne(() => User, (user) => user.cars, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
