import { IsIn, IsNumber, IsString } from 'class-validator';
import { MADE_IN, PURPOSE_USAGE } from '../entities/car.entity';

export class CreateCarDto {
  @IsString()
  plate_no: string;

  @IsString()
  chassis_no: string;

  @IsString()
  engine_no: string;

  @IsString()
  mark_and_model: string;

  @IsNumber()
  seats: number;

  @IsString()
  year_of_manufacture: string;

  @IsString()
  origin: string;

  @IsIn([PURPOSE_USAGE.USAGE, PURPOSE_USAGE.OTHER])
  purpose_of_usage: PURPOSE_USAGE;

  @IsNumber()
  value_of: number;

  @IsIn([MADE_IN.FOREIGN, MADE_IN.DOMESTIC])
  made_in: MADE_IN;
}
