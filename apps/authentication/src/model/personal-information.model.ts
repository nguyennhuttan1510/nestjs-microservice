import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class PersonalInformationModel {
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  country_of_birth: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  is_multi_nationality: string;

  @Column({ nullable: true })
  tax: string;

  @Column()
  email: string;

  @Column()
  national_id: string;

  @Column({ nullable: true })
  date_of_issue: string;

  @Column({ nullable: true })
  place_of_issue: string;

  @CreateDateColumn({ nullable: true })
  birthday: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
