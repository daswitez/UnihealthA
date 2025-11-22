import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ClinicalRecordsService } from './clinical-records.service';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('records')
export class ClinicalRecordsController {
  constructor(private readonly clinicalRecordsService: ClinicalRecordsService) {}

  @Post()
  create(@Body() createClinicalRecordDto: CreateClinicalRecordDto, @Request() req) {
    return this.clinicalRecordsService.create(createClinicalRecordDto, req.user.userId);
  }

  @Get('patient/:patientId')
  findAllByPatient(@Param('patientId') patientId: string) {
    return this.clinicalRecordsService.findAllByPatient(+patientId);
  }

  @Get('my-history')
  findMyHistory(@Request() req) {
    return this.clinicalRecordsService.findAllByPatient(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clinicalRecordsService.findOne(+id);
  }
}
