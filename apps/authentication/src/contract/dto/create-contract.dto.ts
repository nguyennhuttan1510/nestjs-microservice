import { IsNumber } from 'class-validator';

export class CreateContractDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  staff_sales_id: number;

  @IsNumber()
  staff_manager_id: number;

  @IsNumber()
  car_id: number;
}
