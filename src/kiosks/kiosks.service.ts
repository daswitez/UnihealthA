import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateKioskDto } from './dto/create-kiosk.dto';
import { UpdateKioskDto } from './dto/update-kiosk.dto';

@Injectable()
export class KiosksService {
  constructor(private prisma: PrismaService) {}

  async create(createKioskDto: CreateKioskDto) {
    return this.prisma.kiosk.create({
      data: {
        name: createKioskDto.name,
        address: createKioskDto.address,
        city: createKioskDto.city,
        latitude: createKioskDto.latitude,
        longitude: createKioskDto.longitude,
        phone: createKioskDto.phone,
        openTime: createKioskDto.openTime,
        closeTime: createKioskDto.closeTime,
        isActive: createKioskDto.isActive ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.kiosk.findMany({
      where: { isActive: true },
      include: {
        staff: {
          select: {
            userId: true,
            assignedAt: true,
          },
        },
        _count: {
          select: { appointments: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const kiosk = await this.prisma.kiosk.findUnique({
      where: { id },
      include: {
        staff: {
          select: {
            userId: true,
            assignedAt: true,
          },
        },
      },
    });

    if (!kiosk) {
      throw new NotFoundException(`Kiosk with ID ${id} not found`);
    }

    return kiosk;
  }

  async update(id: number, updateKioskDto: UpdateKioskDto) {
    await this.findOne(id); // Verify exists

    return this.prisma.kiosk.update({
      where: { id },
      data: updateKioskDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Verify exists

    return this.prisma.kiosk.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async getStaff(kioskId: number) {
    await this.findOne(kioskId); // Verify kiosk exists

    return this.prisma.kioskStaff.findMany({
      where: { kioskId },
      include: {
        kiosk: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async assignStaff(kioskId: number, userId: number) {
    await this.findOne(kioskId); // Verify kiosk exists

    return this.prisma.kioskStaff.upsert({
      where: {
        kioskId_userId: { kioskId, userId },
      },
      update: {
        assignedAt: new Date(),
      },
      create: {
        kioskId,
        userId,
      },
    });
  }

  async removeStaff(kioskId: number, userId: number) {
    await this.findOne(kioskId); // Verify kiosk exists

    return this.prisma.kioskStaff.delete({
      where: {
        kioskId_userId: { kioskId, userId },
      },
    });
  }

  async findNearby(lat: number, lng: number, radiusKm: number = 10) {
    // Find all active kiosks and filter by distance
    const kiosks = await this.prisma.kiosk.findMany({
      where: {
        isActive: true,
        latitude: { not: null },
        longitude: { not: null },
      },
    });

    // Calculate distance using Haversine formula
    const nearbyKiosks = kiosks
      .map((kiosk) => {
        const distance = this.calculateDistance(
          lat,
          lng,
          Number(kiosk.latitude),
          Number(kiosk.longitude),
        );
        return { ...kiosk, distanceKm: Math.round(distance * 100) / 100 };
      })
      .filter((kiosk) => kiosk.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return nearbyKiosks;
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
