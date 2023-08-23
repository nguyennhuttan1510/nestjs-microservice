import { CreateDateColumn } from 'typeorm';

export abstract class DateTimeModel {
  @CreateDateColumn()
  updated_at: Date;

  @CreateDateColumn()
  created_at: Date;
}
