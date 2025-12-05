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
        kioskId: createAppointmentDto.kioskId,
        start,
        end,
        reason: createAppointmentDto.reason,
        status: 'solicitada',
      },
      include: { patient: true, nurse: true, serviceType: true, kiosk: true },
    });
  }

  findAll() {
    return this.prisma.appointment.findMany({
      include: { patient: true, nurse: true, serviceType: true, kiosk: true },
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

  async getAvailableDoctors() {
    // Get users with role 'doctor'
    const doctorRole = await this.prisma.role.findUnique({ where: { name: 'doctor' } });
    if (!doctorRole) return [];

    return this.prisma.user.findMany({
      where: {
        roleId: doctorRole.id,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getAvailableNurses() {
    // Get users with role 'nurse'
    const nurseRole = await this.prisma.role.findUnique({ where: { name: 'nurse' } });
    if (!nurseRole) return [];

    return this.prisma.user.findMany({
      where: {
        roleId: nurseRole.id,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getServiceTypes() {
    return this.prisma.serviceType.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        code: true,
        name: true,
      },
    });
  }
}
