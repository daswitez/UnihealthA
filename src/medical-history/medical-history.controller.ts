import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { MedicalHistoryService } from './medical-history.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateMedicalHistoryDto,
  UpdateMedicalHistoryDto,
  CreateAllergyDto,
  UpdateAllergyDto,
  CreateMedicationDto,
  UpdateMedicationDto,
  CreateFamilyHistoryDto,
  UpdateFamilyHistoryDto,
  CreateLifestyleDto,
  UpdateLifestyleDto,
  QueryMedicalHistoryDto,
} from './dto';

@UseGuards(AuthGuard('jwt'))
@Controller('medical-history')
export class MedicalHistoryController {
  constructor(
    private readonly medicalHistoryService: MedicalHistoryService,
  ) {}

  // ===========================
  // Medical History Endpoints
  // ===========================

  @Post()
  create(@Body() dto: CreateMedicalHistoryDto, @Request() req) {
    return this.medicalHistoryService.create(dto, req.user.userId);
  }

  @Get('patient/:patientId')
  findAll(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Query() query: QueryMedicalHistoryDto,
    @Request() req,
  ) {
    return this.medicalHistoryService.findAllForPatient(
      patientId,
      req.user.userId,
      query,
    );
  }

  @Get('full/:patientId')
  getFullHistory(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Request() req,
  ) {
    return this.medicalHistoryService.getFullHistory(
      patientId,
      req.user.userId,
    );
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.findOne(id, req.user.userId);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicalHistoryDto,
    @Request() req,
  ) {
    return this.medicalHistoryService.update(id, dto, req.user.userId);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.deactivate(id, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.remove(id, req.user.userId);
  }

  // ===========================
  // Allergies Endpoints
  // ===========================

  @Post('allergies')
  addAllergy(@Body() dto: CreateAllergyDto, @Request() req) {
    return this.medicalHistoryService.addAllergy(dto, req.user.userId);
  }

  @Get('allergies/patient/:patientId')
  findAllergies(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Request() req,
  ) {
    return this.medicalHistoryService.findAllergies(
      patientId,
      req.user.userId,
    );
  }

  @Get('allergies/:id')
  findOneAllergy(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.findOneAllergy(id, req.user.userId);
  }

  @Put('allergies/:id')
  updateAllergy(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAllergyDto,
    @Request() req,
  ) {
    return this.medicalHistoryService.updateAllergy(id, dto, req.user.userId);
  }

  @Delete('allergies/:id')
  removeAllergy(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.removeAllergy(id, req.user.userId);
  }

  // ===========================
  // Medications Endpoints
  // ===========================

  @Post('medications')
  addMedication(@Body() dto: CreateMedicationDto, @Request() req) {
    return this.medicalHistoryService.addMedication(dto, req.user.userId);
  }

  @Get('medications/patient/:patientId')
  findMedications(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Request() req,
  ) {
    return this.medicalHistoryService.findMedications(
      patientId,
      req.user.userId,
      false,
    );
  }

  @Get('medications/patient/:patientId/active')
  findActiveMedications(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Request() req,
  ) {
    return this.medicalHistoryService.findMedications(
      patientId,
      req.user.userId,
      true,
    );
  }

  @Get('medications/:id')
  findOneMedication(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.findOneMedication(id, req.user.userId);
  }

  @Put('medications/:id')
  updateMedication(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMedicationDto,
    @Request() req,
  ) {
    return this.medicalHistoryService.updateMedication(
      id,
      dto,
      req.user.userId,
    );
  }

  @Patch('medications/:id/deactivate')
  deactivateMedication(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.deactivateMedication(
      id,
      req.user.userId,
    );
  }

  @Delete('medications/:id')
  removeMedication(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.removeMedication(id, req.user.userId);
  }

  // ===========================
  // Family History Endpoints
  // ===========================

  @Post('family-history')
  addFamilyHistory(@Body() dto: CreateFamilyHistoryDto, @Request() req) {
    return this.medicalHistoryService.addFamilyHistory(dto, req.user.userId);
  }

  @Get('family-history/patient/:patientId')
  findFamilyHistory(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Request() req,
  ) {
    return this.medicalHistoryService.findFamilyHistory(
      patientId,
      req.user.userId,
    );
  }

  @Get('family-history/:id')
  findOneFamilyHistory(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.medicalHistoryService.findOneFamilyHistory(
      id,
      req.user.userId,
    );
  }

  @Put('family-history/:id')
  updateFamilyHistory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFamilyHistoryDto,
    @Request() req,
  ) {
    return this.medicalHistoryService.updateFamilyHistory(
      id,
      dto,
      req.user.userId,
    );
  }

  @Delete('family-history/:id')
  removeFamilyHistory(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.removeFamilyHistory(
      id,
      req.user.userId,
    );
  }

  // ===========================
  // Lifestyle Endpoints
  // ===========================

  @Post('lifestyle')
  addLifestyle(@Body() dto: CreateLifestyleDto, @Request() req) {
    return this.medicalHistoryService.addLifestyle(dto, req.user.userId);
  }

  @Get('lifestyle/patient/:patientId')
  findLifestyle(
    @Param('patientId', ParseIntPipe) patientId: number,
    @Request() req,
  ) {
    return this.medicalHistoryService.findLifestyle(
      patientId,
      req.user.userId,
    );
  }

  @Put('lifestyle/:id')
  updateLifestyle(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLifestyleDto,
    @Request() req,
  ) {
    return this.medicalHistoryService.updateLifestyle(
      id,
      dto,
      req.user.userId,
    );
  }

  @Delete('lifestyle/:id')
  removeLifestyle(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.medicalHistoryService.removeLifestyle(id, req.user.userId);
  }
}
