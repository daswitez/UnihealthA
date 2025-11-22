import { Injectable } from '@nestjs/common';
import { CreateVitalDto } from './dto/create-vital.dto';
import { UpdateVitalDto } from './dto/update-vital.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VitalsService {
  constructor(private prisma: PrismaService) {}

  create(createVitalDto: CreateVitalDto, takenByUserId: number) {
    return this.prisma.vitals.create({
      data: {
        patientId: createVitalDto.patientId,
        takenById: takenByUserId,
        systolicBP: createVitalDto.systolicBP,
        diastolicBP: createVitalDto.diastolicBP,
        heartRate: createVitalDto.heartRate,
        tempC: createVitalDto.tempC,
        spo2: createVitalDto.spo2,
      },
    });
  }

  findAllByPatient(patientId: number) {
    return this.prisma.vitals.findMany({
      where: { patientId },
      include: {
        takenBy: { select: { email: true } },
      },
      orderBy: { takenAt: 'desc' },
    });
  }
}
