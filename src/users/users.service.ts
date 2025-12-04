import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Buscar el rol especificado o usar 'user' por defecto
    const roleName = createUserDto.role || 'user';
    const role = await this.prisma.role.findUnique({ where: { name: roleName } });
    
    if (!role) {
      throw new Error(`Role '${roleName}' not found`);
    }

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: hashedPassword,
        roleId: role.id,
      },
      include: {
        role: true,
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      include: { role: true, patientProfile: true }
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true, patientProfile: true }
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { role: true }
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: updateUserDto.isActive
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
