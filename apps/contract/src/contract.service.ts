import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContractEntity } from './entities/contract.entities';
import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { AxiosError, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { User } from '@authentication/users/entities/user.entity';
import { Response } from '@app/interceptor';
import { Staff } from '@authentication/staff/entities/staff.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(ContractEntity)
    private contractRepository: Repository<ContractEntity>,
    private readonly httpService: HttpService,
  ) {}
  async create(createContractDto: CreateContractDto): Promise<ContractEntity> {
    try {
      const bank: DeepPartial<ContractEntity> = {
        user_id: createContractDto.user_id,
        object_insured_id: createContractDto.object_insured_id,
        staff_id: createContractDto.staff_id,
        staff_manager_id: createContractDto.staff_manager_id,
      };
      return await this.contractRepository.save(bank);
    } catch (e) {
      throw e;
    }
  }

  async findAll(): Promise<ContractEntity[]> {
    try {
      return await this.contractRepository.find();
    } catch (e) {
      throw e;
    }
  }

  async findOne(id: number): Promise<any> {
    try {
      const contract: ContractEntity = await this.contractRepository.findOneBy({
        contract_id: id,
      });
      console.log('contract', contract);
      const user: AxiosResponse<Response<User>> = await firstValueFrom(
        this.httpService
          .get(`http://localhost:4000/users/${contract.user_id}`)
          .pipe(
            catchError((error: AxiosError) => {
              throw `${error.response.data}`;
            }),
          ),
      );
      console.log('user', user)
      const staff: AxiosResponse<Response<Staff>> = await firstValueFrom(
        this.httpService
          .get(`http://localhost:4000/staff/${contract.staff_id}`)
          .pipe(
            catchError((error: AxiosError) => {
              throw `${error.response.data}`;
            }),
          ),
      );
      const staffManager: AxiosResponse<Response<Staff>> = await firstValueFrom(
        this.httpService
          .get(`http://localhost:4000/staff/${contract.staff_manager_id}`)
          .pipe(
            catchError((error: AxiosError) => {
              throw `${error.response.data}`;
            }),
          ),
      );
      return {
        contract_id: contract.contract_id,
        staff: staff.data.data,
        staffManager: staffManager.data.data,
        user: user.data.data,
        created_at: contract.created_at,
        updated_at: contract.updated_at,
      };
    } catch (e) {
      throw e;
    }
  }

  async update(
    id: number,
    updateContractDto: UpdateContractDto,
  ): Promise<ContractEntity> {
    try {
      const bank: DeepPartial<ContractEntity> = {
        contract_id: id,
        staff_manager_id: updateContractDto.staff_manager_id,
        staff_id: updateContractDto.staff_id,
        object_insured_id: updateContractDto.object_insured_id,
        user_id: updateContractDto.user_id,
      };
      return await this.contractRepository.save(bank);
    } catch (e) {
      throw e;
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.contractRepository.delete(id);
    } catch (e) {
      throw e;
    }
  }
}
