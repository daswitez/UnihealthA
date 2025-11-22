import { Injectable } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async create(createPatientDto: CreatePatientDto, createdByUserId: number) {
    // 1. Crear Usuario para el paciente (email ficticio si no tiene)
    // En un sistema real, el paciente podría tener su propio email.
    // Aquí generamos uno si no viene.
    const email = createPatientDto.email || `patient.${Date.now()}@unihealth.com`;
    const password = await bcrypt.hash('tempPassword123', 10); // Password temporal
    
    // Buscar rol 'user' (asumimos que paciente es un user con perfil)
    const role = await this.prisma.role.findUnique({ where: { name: 'user' } });
    
    return this.prisma.$transaction(async (tx) => {
      // Crear Usuario
      const user = await tx.user.create({
        data: {
          email,
          passwordHash: password,
          roleId: role ? role.id : 1,
        },
      });

      // Crear Perfil
      const profile = await tx.patientProfile.create({
        data: {
          userId: user.id,
          firstName: createPatientDto.firstName,
          lastName: createPatientDto.lastName,
          dob: new Date(createPatientDto.dob),
          gender: createPatientDto.gender,
          // phone se pierde si no está en el modelo, agregarlo si es crítico
        },
      });
      
      return { ...user, profile };
    });
  }

  findAll() {
    // Buscar usuarios que tengan perfil de paciente
    return this.prisma.user.findMany({
      where: {
        patientProfile: { isNot: null }
      },
      include: { patientProfile: true }
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { patientProfile: true }
    });
  }

  update(id: number, updatePatientDto: UpdatePatientDto) {
    const { firstName, lastName, dob, gender, ...rest } = updatePatientDto;
    
    return this.prisma.patientProfile.update({
      where: { userId: id },
      data: {
        firstName,
        lastName,
        dob: dob ? new Date(dob) : undefined,
        gender,
      },
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
