import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DateTimeModel } from '@authentication/common/entities/datetime.model';
import { Account } from '@authentication/account/entities/account.entity';

@Entity('auth')
export class Auth extends DateTimeModel {
  @PrimaryColumn({
    type: 'nvarchar',
  })
  session_id: string;

  // @Column({
  //   type: 'longtext',
  //   default: null,
  //   nullable: true,
  // })
  // access_token: string;

  @Column({
    default: null,
    nullable: true,
  })
  refresh_token: string;

  @Column({
    default: false,
    type: 'boolean',
  })
  cancel: boolean;

  @ManyToOne(() => Account, (account) => account.auths, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'account_id' })
  account;
}
