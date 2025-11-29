import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccessService {
  constructor(private prisma: PrismaService) {}

  async grantAccess(patientId: number, doctorId: number, pin: string, permissions: any) {
    // 1. Verify Patient PIN
    const patient = await this.prisma.user.findUnique({ where: { id: BigInt(patientId) } });
    if (!patient || !patient.pinHash) {
      throw new BadRequestException('Patient has no PIN set');
    }

    const isPinValid = await bcrypt.compare(pin, patient.pinHash);
    if (!isPinValid) {
      throw new UnauthorizedException('Invalid PIN');
    }

    // 2. Create or Update Access Grant
    // Check if active grant exists
    const existing = await this.prisma.medicalAccess.findFirst({
        where: {
            patientId: BigInt(patientId),
            staffId: BigInt(doctorId),
            isActive: true
        }
    });

    if (existing) {
        return this.prisma.medicalAccess.update({
            where: { id: existing.id },
            data: {
                permissions,
                grantedAt: new Date(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Default 24h access? Or make it configurable
            }
        });
    }

    return this.prisma.medicalAccess.create({
      data: {
        patientId: BigInt(patientId),
        staffId: BigInt(doctorId),
        permissions,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h default
      },
    });
  }

  async revokeAccess(patientId: number, doctorId: number) {
    return this.prisma.medicalAccess.updateMany({
      where: {
        patientId: BigInt(patientId),
        staffId: BigInt(doctorId),
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });
  }

  async checkAccess(patientId: number, doctorId: number) {
    const grant = await this.prisma.medicalAccess.findFirst({
      where: {
        patientId: BigInt(patientId),
        staffId: BigInt(doctorId),
        isActive: true,
      },
    });

    if (!grant) return false;
    if (grant.expiresAt && grant.expiresAt < new Date()) {
        // Expired
        await this.revokeAccess(patientId, doctorId);
        return false;
    }
    return grant;
  }
}
