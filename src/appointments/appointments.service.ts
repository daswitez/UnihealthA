import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    const start = new Date(createAppointmentDto.start);
    const end = new Date(createAppointmentDto.end);

    // Validar conflicto de horario para el enfermero
    const conflict = await this.prisma.appointment.findFirst({
      where: {
        nurseId: createAppointmentDto.nurseId,
        status: { not: 'cancelada' },
        OR: [
          { start: { lte: start }, end: { gt: start } },
          { start: { lt: end }, end: { gte: end } },
        ],
      },
    });

    if (conflict) {
      throw new BadRequestException('El enfermero ya tiene una cita en ese horario.');
    }

    return this.prisma.appointment.create({
      data: {
        patientId: createAppointmentDto.patientId,
        nurseId: createAppointmentDto.nurseId,
        serviceTypeId: createAppointmentDto.serviceTypeId,
        start,
        end,
        reason: createAppointmentDto.reason,
        status: 'solicitada',
      },
      include: { patient: true, nurse: true, serviceType: true },
    });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      include: { patient: true, nurse: true, serviceType: true },
      orderBy: { start: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: { patient: true, nurse: true, serviceType: true },
    });
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return this.prisma.appointment.update({
      where: { id },
      data: {
        status: updateAppointmentDto.status,
      },
    });
  }
}
