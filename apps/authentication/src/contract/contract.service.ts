import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from './entities/contract.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { UsersService } from '@authentication/users/users.service';
import { StaffService } from '@authentication/staff/staff.service';
import { CarService } from '@authentication/car/car.service';
import { Car } from '@authentication/car/entities/car.entity';
import { User } from '@authentication/users/entities/user.entity';
import { Staff } from '@authentication/staff/entities/staff.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    private userService: UsersService,
    private staffService: StaffService,
    private carService: CarService,
  ) {}

  private defaultOptionFindOne: (id: number) => FindOneOptions<Contract> = (
    id: number,
  ) => {
    return {
      where: {
        contract_id: id,
      },
    };
  };

  async create(createContractDto: CreateContractDto) {
    const optionsFindContract: FindOneOptions<Contract> = {
      where: {
        object_insurance: {
          car_id: createContractDto.car_id,
        },
      },
    };
    const isCarExistContract = await this.findOne(
      createContractDto.car_id,
      optionsFindContract,
    );
    if (isCarExistContract)
      throw new BadRequestException(
        'Object insured is exist in other contract',
      );

    try {
      //FIND CAR
      const car: Car = await this.carService.findOne(createContractDto.car_id);

      //FIND USER
      const user: User = await this.userService.findOne(
        createContractDto.user_id,
      );

      //FIND STAFF_SALES
      const staffSales: Staff = await this.staffService.findOne(
        createContractDto.staff_sales_id,
      );

      //FIND STAFF_MANAGER
      const staffManager: Staff = await this.staffService.findOne(
        createContractDto.staff_manager_id,
      );

      const contractEntity = this.contractRepository.create({
        user: user,
        staffs: [staffSales, staffManager],
        object_insurance: car,
      });
      return await this.contractRepository.save(contractEntity);
    } catch (e) {
      throw e;
    }
  }

  async findAll() {
    try {
      return await this.contractRepository.find({
        relations: {
          staffs: true,
          user: true,
          object_insurance: true,
        },
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(
    id: number,
    options: FindOneOptions = this.defaultOptionFindOne(id),
  ) {
    try {
      return await this.contractRepository.findOne(options);
    } catch (e) {
      throw new InternalServerErrorException('Failed to find contract');
    }
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  async remove(id: number) {
    try {
      return await this.contractRepository.delete(id);
    } catch (e) {
      throw e;
    }
  }
}
