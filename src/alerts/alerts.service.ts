import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class AlertsService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('alerts') private alertsQueue: Queue,
  ) {}

  async create(createAlertDto: CreateAlertDto) {
    try {
      const alert = await this.prisma.alert.create({
        data: {
          patientId: createAlertDto.patientId,
          typeId: createAlertDto.typeId,
          latitude: createAlertDto.latitude,
          longitude: createAlertDto.longitude,
          description: createAlertDto.description,
          status: 'pendiente',
        },
        include: { patient: { include: { patientProfile: true } }, type: true },
      });

      // Encolar job para notificar
      const patientName = alert.patient?.patientProfile 
        ? `${alert.patient.patientProfile.firstName} ${alert.patient.patientProfile.lastName}`
        : 'Desconocido';

      await this.alertsQueue.add('new-alert', {
        alertId: Number(alert.id),
        patientName,
        type: alert.type?.name,
        location: { lat: alert.latitude, lng: alert.longitude },
      });

      return alert;
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }

  findAll() {
    return this.prisma.alert.findMany({
      include: { patient: true, type: true, assignedTo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.alert.findUnique({
      where: { id },
      include: { patient: true, type: true, assignedTo: true, events: true },
    });
  }

  update(id: number, updateAlertDto: UpdateAlertDto) {
    return this.prisma.alert.update({
      where: { id },
      data: {
        status: updateAlertDto.status,
        assignedToId: updateAlertDto.assignedToId,
        resolvedAt: updateAlertDto.status === 'resuelta' ? new Date() : undefined,
      },
    });
  }

  async assign(id: number, nurseId: number) {
    return this.prisma.alert.update({
      where: { id },
      data: {
        assignedToId: nurseId,
        status: 'en curso',
      },
    });
  }
}
