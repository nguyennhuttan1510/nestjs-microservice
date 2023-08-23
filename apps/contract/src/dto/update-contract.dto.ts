import { CreateContractDto } from './create-contract.dto';
import { IsNumber } from 'class-validator';

export class UpdateContractDto extends CreateContractDto {
  @IsNumber()
  contract_id: number;
}
