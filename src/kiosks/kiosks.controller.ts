import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { KiosksService } from './kiosks.service';
import { CreateKioskDto } from './dto/create-kiosk.dto';
import { UpdateKioskDto } from './dto/update-kiosk.dto';
import { AssignStaffDto } from './dto/assign-staff.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('kiosks')
export class KiosksController {
  constructor(private readonly kiosksService: KiosksService) {}

  @Post()
  create(@Body() createKioskDto: CreateKioskDto) {
    return this.kiosksService.create(createKioskDto);
  }

  @Get()
  findAll() {
    return this.kiosksService.findAll();
  }

  @Get('nearby')
  findNearby(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
  ) {
    return this.kiosksService.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      radius ? parseFloat(radius) : 10,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.kiosksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateKioskDto: UpdateKioskDto) {
    return this.kiosksService.update(+id, updateKioskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.kiosksService.remove(+id);
  }

  @Get(':id/staff')
  getStaff(@Param('id') id: string) {
    return this.kiosksService.getStaff(+id);
  }

  @Post(':id/staff')
  assignStaff(@Param('id') id: string, @Body() assignStaffDto: AssignStaffDto) {
    return this.kiosksService.assignStaff(+id, assignStaffDto.userId);
  }

  @Delete(':id/staff/:userId')
  removeStaff(@Param('id') id: string, @Param('userId') userId: string) {
    return this.kiosksService.removeStaff(+id, +userId);
  }
}
