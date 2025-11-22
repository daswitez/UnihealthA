import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { VitalsService } from './vitals.service';
import { CreateVitalDto } from './dto/create-vital.dto';
import { UpdateVitalDto } from './dto/update-vital.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Post()
  create(@Body() createVitalDto: CreateVitalDto, @Request() req) {
    return this.vitalsService.create(createVitalDto, req.user.userId);
  }

  @Get('patient/:patientId')
  findAllByPatient(@Param('patientId') patientId: string) {
    return this.vitalsService.findAllByPatient(+patientId);
  }
  @Get('my-history')
  findMyHistory(@Request() req) {
    return this.vitalsService.findAllByPatient(req.user.userId);
  }
}
