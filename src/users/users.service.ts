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
    
    // Por defecto asignamos rol 'user' si no se especifica.
    // Buscamos el ID del rol 'user'.
    const defaultRole = await this.prisma.role.findUnique({ where: { name: 'user' } });
    
    // Si no existe el rol (no debería pasar si corrió el seed), usamos 1 como fallback o lanzamos error.
    const roleId = defaultRole ? defaultRole.id : 1;

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: hashedPassword,
        roleId: roleId,
        // name no existe en User, se debe crear PatientProfile si es necesario, pero por ahora lo omitimos
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
