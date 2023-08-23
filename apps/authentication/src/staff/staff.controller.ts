import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { Staff } from './entities/staff.entity';
import { DeleteResult } from 'typeorm';
import { Response } from '@app/interceptor/response.interceptor';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(
    @Body() createStaffDto: CreateStaffDto,
  ): Promise<Response<Staff>> {
    const staff: Staff = await this.staffService.create(createStaffDto);
    return {
      data: staff,
      status: true,
      message: 'Create user success',
    };
  }

  @Get()
  async findAll(): Promise<Response<Staff[]>> {
    const staffs = await this.staffService.findAll();
    return {
      data: staffs,
      status: true,
      message: 'Find Staff success',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Response<Staff>> {
    const staff: Staff = await this.staffService.findOne(+id);
    return {
      data: staff,
      status: true,
      message: 'Find Staff success',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ): Promise<Response<Staff>> {
    const staff: Staff = await this.staffService.update(+id, updateStaffDto);
    return {
      data: staff,
      status: true,
      message: 'Update staff success',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Response<DeleteResult>> {
    const result: DeleteResult = await this.staffService.remove(+id);
    return {
      data: result,
      status: true,
      message: 'Delete Staff success',
    };
  }
}
