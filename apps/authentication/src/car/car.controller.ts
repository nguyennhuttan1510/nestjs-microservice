import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { Car } from '@authentication/car/entities/car.entity';
import { Response } from '@app/interceptor';
import { DeleteResult } from 'typeorm';

@Controller('car')
export class CarController {
  constructor(
    private readonly carService: CarService, // private readonly mailerService: MailService,
  ) {}

  @Post()
  async create(@Body() createCarDto: CreateCarDto): Promise<Response<Car>> {
    const car: Car = await this.carService.create(createCarDto);
    return {
      data: car,
      status: true,
      message: 'Create car success',
    };
  }

  @Get()
  async findAll(): Promise<Response<Car[]>> {
    const cars: Car[] = await this.carService.findAll();
    // this.mailerService.sendMail();
    return {
      data: cars,
      status: true,
      message: 'Get cars success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<Car>> {
    const car: Car = await this.carService.findOne(+id);
    return {
      data: car,
      status: true,
      message: 'Get car success',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Response<Car>> {
    const car: Car = await this.carService.update(+id, updateCarDto);
    return {
      data: car,
      status: true,
      message: 'Update car success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response<DeleteResult>> {
    const result = await this.carService.remove(+id);
    return {
      data: result,
      status: true,
      message: 'Delete car success',
    };
  }
}
