import { IsNumber } from 'class-validator';

export class CreateContractDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  object_insured_id: number;

  @IsNumber()
  staff_id: number;

  @IsNumber()
  staff_manager_id: number;
}
