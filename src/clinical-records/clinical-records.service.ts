import { Injectable } from '@nestjs/common';
import { CreateClinicalRecordDto } from './dto/create-clinical-record.dto';
import { UpdateClinicalRecordDto } from './dto/update-clinical-record.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClinicalRecordsService {
  constructor(private prisma: PrismaService) {}

  create(createClinicalRecordDto: CreateClinicalRecordDto, createdByUserId: number) {
    return this.prisma.clinicalRecord.create({
      data: {
        patientId: createClinicalRecordDto.patientId,
        noteTypeId: createClinicalRecordDto.noteTypeId,
        note: createClinicalRecordDto.note,
        createdById: createdByUserId,
      },
    });
  }

  findAllByPatient(patientId: number) {
    return this.prisma.clinicalRecord.findMany({
      where: { patientId },
      include: {
        createdBy: { select: { email: true, role: true } },
        noteType: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.clinicalRecord.findUnique({
      where: { id },
      include: {
        createdBy: { select: { email: true } },
        noteType: true,
      },
    });
  }

  // Update and remove can be implemented if needed, usually records are append-only or have strict audit
}
