import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from './entities/car.entity';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

@Injectable()
export class CarService {
  constructor(@InjectRepository(Car) private carRepository: Repository<Car>) {}
  async create(createCarDto: CreateCarDto): Promise<Car> {
    try {
      const car: DeepPartial<Car> = {
        plate_no: createCarDto.plate_no,
        chassis_no: createCarDto.chassis_no,
        engine_no: createCarDto.engine_no,
        mark_and_model: createCarDto.mark_and_model,
        seats: createCarDto.seats,
        year_of_manufacture: createCarDto.year_of_manufacture,
        origin: createCarDto.origin,
        purpose_of_usage: createCarDto.purpose_of_usage,
        value_of: createCarDto.value_of,
        made_in: createCarDto.made_in,
      };
      return await this.carRepository.save(car);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Failed to create info car', {
        cause: new Error(e),
      });
    }
  }

  async findAll(): Promise<Car[]> {
    try {
      return await this.carRepository.find();
    } catch (e) {
      throw new InternalServerErrorException('Failed to find info cars');
    }
  }

  async findOne(id: number): Promise<Car> {
    try {
      return await this.carRepository.findOneBy({ car_id: id });
    } catch (e) {
      throw new InternalServerErrorException('Failed to find info car');
    }
  }

  async update(id: number, updateCarDto: UpdateCarDto): Promise<Car> {
    try {
      const car: DeepPartial<Car> = {
        car_id: id,
        chassis_no: updateCarDto.chassis_no,
        engine_no: updateCarDto.engine_no,
        mark_and_model: updateCarDto.mark_and_model,
        seats: updateCarDto.seats,
        year_of_manufacture: updateCarDto.year_of_manufacture,
        origin: updateCarDto.origin,
        purpose_of_usage: updateCarDto.purpose_of_usage,
        value_of: updateCarDto.value_of,
        made_in: updateCarDto.made_in,
      };
      return await this.carRepository.save(car);
    } catch (e) {
      throw new InternalServerErrorException('Failed to update info car');
    }
  }

  async remove(id: number): Promise<DeleteResult> {
    try {
      return await this.carRepository.delete(id);
    } catch (e) {
      throw new InternalServerErrorException('Failed to delete info car');
    }
  }
}
