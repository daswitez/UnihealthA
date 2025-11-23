import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ParametersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.systemParameter.findMany();
  }

  findOne(key: string) {
    return this.prisma.systemParameter.findUnique({
      where: { key },
    });
  }

  update(key: string, value: string) {
    return this.prisma.systemParameter.upsert({
      where: { key },
      update: { value },
      create: { key, value, description: 'Auto-created' },
    });
  }
}
