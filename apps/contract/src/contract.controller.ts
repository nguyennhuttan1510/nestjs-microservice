import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ContractService } from './contract.service';
import { Response } from '@app/interceptor/response.interceptor';
import { HTTPExceptionFilter } from '@app/exception/http-exception.filter';
import { CreateContractDto } from './dto/create-contract.dto';
import { ContractEntity } from './entities/contract.entities';
import { UpdateContractDto } from './dto/update-contract.dto';
@UseFilters(HTTPExceptionFilter)
@Controller('contract')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
  }

  @Get()
  async findAll(): Promise<Response<ContractEntity[]>> {
    const contract = await this.contractService.findAll();
    return {
      data: contract,
      status: true,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(+id, updateContractDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractService.remove(+id);
  }
}
