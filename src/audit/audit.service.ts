import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(userId: number | null, action: string, resource: string, resourceId: string | null, details: any, ip: string) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          resource,
          resourceId,
          details: details || {},
          ip,
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
    }
  }
}
