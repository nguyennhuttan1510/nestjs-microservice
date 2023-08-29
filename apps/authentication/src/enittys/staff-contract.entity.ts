import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('staff_contract')
export class StaffContractEntity {
  @PrimaryColumn()
  staff_id: number;

  @PrimaryColumn()
  contract_id: number;

  // @ManyToOne(() => Contract, (contract) => contract.staffs, {
  //   onDelete: 'NO ACTION',
  //   onUpdate: 'NO ACTION',
  // })
  // @JoinColumn([{ name: 'contract_id', referencedColumnName: 'contract_id' }])
  // contract: Contract[];
  //
  // @ManyToOne(() => Staff, (staff) => staff.contracts, {
  //   onDelete: 'NO ACTION',
  //   onUpdate: 'NO ACTION',
  // })
  // @JoinColumn([{ name: 'staff_id', referencedColumnName: 'staff_id' }])
  // staff: Staff[];
}
