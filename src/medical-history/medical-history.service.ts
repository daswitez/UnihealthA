import { 
  Injectable, 
  ForbiddenException, 
  NotFoundException,
  BadRequestException,
  Logger 
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AccessService } from '../access/access.service';
import {
  CreateMedicalHistoryDto,
  UpdateMedicalHistoryDto,
  CreateAllergyDto,
  UpdateAllergyDto,
  CreateMedicationDto,
  UpdateMedicationDto,
  CreateFamilyHistoryDto,
  UpdateFamilyHistoryDto,
  CreateLifestyleDto,
  UpdateLifestyleDto,
  QueryMedicalHistoryDto,
} from './dto';
import {
  PaginatedResponse,
  FullHistoryResponse,
  AccessPermissions,
  hasPermissionForType,
  isAccessExpired,
} from './interfaces/medical-history.interfaces';

@Injectable()
export class MedicalHistoryService {
  private readonly logger = new Logger(MedicalHistoryService.name);

  constructor(
    private prisma: PrismaService,
    private accessService: AccessService,
  ) {}

  // ===========================
  // Helper Methods
  // ===========================

  /**
   * Check if requester has access to patient and return permissions
   * @returns permissions object or null if requester is the patient
   */
  private async checkAndGetPermissions(
    patientId: number,
    requesterId: number
  ): Promise<AccessPermissions | null> {
    // If requester is the patient, grant full access
    if (patientId === requesterId) {
      return null; // null means patient accessing own records
    }

    // Check if requester has medical access grant
    const grant = await this.accessService.checkAccess(patientId, requesterId);
    
    // If no grant exists, allow full access for now (backwards compatibility)
    // TODO: In production, enforce strict access control
    if (!grant) {
      this.logger.warn(`No access grant found for requester ${requesterId} to patient ${patientId}, allowing access for backwards compatibility`);
      return null; // null means full access
    }

    // Check if access has expired
    if (isAccessExpired(grant as any)) {
      throw new ForbiddenException('Your access to this patient has expired');
    }

    return grant.permissions as unknown as AccessPermissions;
  }

  /**
   * Validate that requester can create/update records of specific type
   */
  private async validateAccessForType(
    patientId: number,
    requesterId: number,
    type: 'fisico' | 'mental'
  ): Promise<void> {
    const permissions = await this.checkAndGetPermissions(patientId, requesterId);
    
    // If permissions is null, requester is patient - allow all
    if (permissions === null) return;

    // Check specific permission for type
    if (!hasPermissionForType(permissions, type)) {
      throw new ForbiddenException(
        `You do not have permission to access ${type} records for this patient`
      );
    }
  }

  /**
   * Validate that requester can access patient records (any type)
   */
  private async validateAccess(
    patientId: number,
    requesterId: number
  ): Promise<void> {
    await this.checkAndGetPermissions(patientId, requesterId);
  }

  // ===========================
  // Medical History CRUD
  // ===========================

  async create(
    dto: CreateMedicalHistoryDto,
    createdByUserId: number
  ) {
    this.logger.log(`Creating medical history for patient ${dto.patientId} by user ${createdByUserId}`);

    // Validate access and permissions for specific type
    await this.validateAccessForType(dto.patientId, createdByUserId, dto.type);

    const result = await this.prisma.medicalHistory.create({
      data: {
        patientId: BigInt(dto.patientId),
        condition: dto.condition,
        diagnosis: dto.diagnosis,
        treatment: dto.treatment,
        diagnosedAt: dto.diagnosedAt ? new Date(dto.diagnosedAt) : null,
        type: dto.type,
        notes: dto.notes,
      },
    });
    
    this.logger.log(`Medical history created successfully with ID: ${result.id}`);
    return result;
  }

  async findAllForPatient(
    patientId: number,
    requesterId: number,
    query: QueryMedicalHistoryDto
  ): Promise<PaginatedResponse<any>> {
    this.logger.log(`Fetching medical history for patient ${patientId} by user ${requesterId}`);

    // Check access and get permissions
    const permissions = await this.checkAndGetPermissions(patientId, requesterId);

    // Build where clause
    const where: any = { patientId: BigInt(patientId) };

    // Filter by type based on permissions
    if (permissions !== null) {
      const allowedTypes: string[] = [];
      if (permissions.fisico) allowedTypes.push('fisico');
      if (permissions.mental) allowedTypes.push('mental');
      
      if (allowedTypes.length === 0) {
        throw new ForbiddenException('You do not have permission to view any medical records for this patient');
      }
      
      where.type = { in: allowedTypes };
    }

    // Apply query filters
    if (query.type) {
      // Validate permission for requested type if not patient
      if (permissions !== null) {
        if (!hasPermissionForType(permissions, query.type)) {
          throw new ForbiddenException(`You do not have permission to view ${query.type} records`);
        }
      }
      where.type = query.type;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    // Pagination
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    // Execute query with pagination
    const [items, total] = await Promise.all([
      this.prisma.medicalHistory.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [query.sortBy ?? 'createdAt']: (query.sortOrder ?? 'DESC').toLowerCase() as 'asc' | 'desc',
        },
      }),
      this.prisma.medicalHistory.count({ where }),
    ]);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number, requesterId: number) {
    const record = await this.prisma.medicalHistory.findUnique({
      where: { id: BigInt(id) },
    });

    if (!record) {
      throw new NotFoundException(`Medical history record ${id} not found`);
    }

    // Validate access for this patient
    const patientId = Number(record.patientId);
    await this.validateAccessForType(patientId, requesterId, record.type as any);

    return record;
  }

  async update(
    id: number,
    dto: UpdateMedicalHistoryDto,
    requesterId: number
  ) {
    // First find the record to check patient and type
    const existing = await this.prisma.medicalHistory.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existing) {
      throw new NotFoundException(`Medical history record ${id} not found`);
    }

    const patientId = Number(existing.patientId);
    
    // Validate access for existing type
    await this.validateAccessForType(patientId, requesterId, existing.type as any);

    // If changing type, validate new type too
    if (dto.type && dto.type !== existing.type) {
      await this.validateAccessForType(patientId, requesterId, dto.type);
    }

    return this.prisma.medicalHistory.update({
      where: { id: BigInt(id) },
      data: {
        condition: dto.condition,
        diagnosis: dto.diagnosis,
        treatment: dto.treatment,
        diagnosedAt: dto.diagnosedAt ? new Date(dto.diagnosedAt) : undefined,
        type: dto.type,
        notes: dto.notes,
        isActive: dto.isActive,
      },
    });
  }

  async deactivate(id: number, requesterId: number) {
    const existing = await this.findOne(id, requesterId); // This validates access
    
    return this.prisma.medicalHistory.update({
      where: { id: BigInt(id) },
      data: { isActive: false },
    });
  }

  async remove(id: number, requesterId: number) {
    const existing = await this.findOne(id, requesterId); // This validates access
    
    return this.prisma.medicalHistory.delete({
      where: { id: BigInt(id) },
    });
  }

  // ===========================
  // Allergies CRUD
  // ===========================

  async addAllergy(dto: CreateAllergyDto, requesterId: number) {
    this.logger.log(`Adding allergy for patient ${dto.patientId} by user ${requesterId}`);
    
    await this.validateAccess(dto.patientId, requesterId);

    return this.prisma.allergy.create({
      data: {
        patientId: BigInt(dto.patientId),
        allergen: dto.allergen,
        reaction: dto.reaction,
        severity: dto.severity,
        notes: dto.notes,
      },
    });
  }

  async findAllergies(patientId: number, requesterId: number) {
    await this.validateAccess(patientId, requesterId);

    return this.prisma.allergy.findMany({
      where: { patientId: BigInt(patientId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneAllergy(id: number, requesterId: number) {
    const allergy = await this.prisma.allergy.findUnique({
      where: { id: BigInt(id) },
    });

    if (!allergy) {
      throw new NotFoundException(`Allergy ${id} not found`);
    }

    await this.validateAccess(Number(allergy.patientId), requesterId);
    return allergy;
  }

  async updateAllergy(
    id: number,
    dto: UpdateAllergyDto,
    requesterId: number
  ) {
    const existing = await this.findOneAllergy(id, requesterId);

    return this.prisma.allergy.update({
      where: { id: BigInt(id) },
      data: {
        allergen: dto.allergen,
        reaction: dto.reaction,
        severity: dto.severity,
        notes: dto.notes,
      },
    });
  }

  async removeAllergy(id: number, requesterId: number) {
    await this.findOneAllergy(id, requesterId); // Validates access

    return this.prisma.allergy.delete({
      where: { id: BigInt(id) },
    });
  }

  // ===========================
  // Medications CRUD
  // ===========================

  async addMedication(dto: CreateMedicationDto, requesterId: number) {
    this.logger.log(`Adding medication for patient ${dto.patientId} by user ${requesterId}`);
    
    await this.validateAccess(dto.patientId, requesterId);

    // Validate that startDate is before endDate
    if (dto.startDate && dto.endDate) {
      if (new Date(dto.startDate) > new Date(dto.endDate)) {
        throw new BadRequestException('Start date cannot be after end date');
      }
    }

    return this.prisma.medication.create({
      data: {
        patientId: BigInt(dto.patientId),
        name: dto.name,
        dosage: dto.dosage,
        frequency: dto.frequency,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findMedications(
    patientId: number,
    requesterId: number,
    activeOnly: boolean = false
  ) {
    await this.validateAccess(patientId, requesterId);

    const where: any = { patientId: BigInt(patientId) };
    if (activeOnly) {
      where.isActive = true;
    }

    return this.prisma.medication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneMedication(id: number, requesterId: number) {
    const medication = await this.prisma.medication.findUnique({
      where: { id: BigInt(id) },
    });

    if (!medication) {
      throw new NotFoundException(`Medication ${id} not found`);
    }

    await this.validateAccess(Number(medication.patientId), requesterId);
    return medication;
  }

  async updateMedication(
    id: number,
    dto: UpdateMedicationDto,
    requesterId: number
  ) {
    const existing = await this.findOneMedication(id, requesterId);

// Validate date logic
    if (dto.startDate && dto.endDate) {
      if (new Date(dto.startDate) > new Date(dto.endDate)) {
        throw new BadRequestException('Start date cannot be after end date');
      }
    }

    return this.prisma.medication.update({
      where: { id: BigInt(id) },
      data: {
        name: dto.name,
        dosage: dto.dosage,
        frequency: dto.frequency,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        isActive: dto.isActive,
      },
    });
  }

  async deactivateMedication(id: number, requesterId: number) {
    await this.findOneMedication(id, requesterId);

    return this.prisma.medication.update({
      where: { id: BigInt(id) },
      data: { isActive: false },
    });
  }

  async removeMedication(id: number, requesterId: number) {
    await this.findOneMedication(id, requesterId);

    return this.prisma.medication.delete({
      where: { id: BigInt(id) },
    });
  }

  // ===========================
  // Family History CRUD
  // ===========================

  async addFamilyHistory(dto: CreateFamilyHistoryDto, requesterId: number) {
    this.logger.log(`Adding family history for patient ${dto.patientId} by user ${requesterId}`);
    
    await this.validateAccess(dto.patientId, requesterId);

    return this.prisma.familyHistory.create({
      data: {
        patientId: BigInt(dto.patientId),
        relationship: dto.relationship,
        condition: dto.condition,
        notes: dto.notes,
      },
    });
  }

  async findFamilyHistory(patientId: number, requesterId: number) {
    await this.validateAccess(patientId, requesterId);

    return this.prisma.familyHistory.findMany({
      where: { patientId: BigInt(patientId) },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneFamilyHistory(id: number, requesterId: number) {
    const record = await this.prisma.familyHistory.findUnique({
      where: { id: BigInt(id) },
    });

    if (!record) {
      throw new NotFoundException(`Family history record ${id} not found`);
    }

    await this.validateAccess(Number(record.patientId), requesterId);
    return record;
  }

  async updateFamilyHistory(
    id: number,
    dto: UpdateFamilyHistoryDto,
    requesterId: number
  ) {
    await this.findOneFamilyHistory(id, requesterId);

    return this.prisma.familyHistory.update({
      where: { id: BigInt(id) },
      data: {
        relationship: dto.relationship,
        condition: dto.condition,
        notes: dto.notes,
      },
    });
  }

  async removeFamilyHistory(id: number, requesterId: number) {
    await this.findOneFamilyHistory(id, requesterId);

    return this.prisma.familyHistory.delete({
      where: { id: BigInt(id) },
    });
  }

  // ===========================
  // Lifestyle CRUD
  // ===========================

  async addLifestyle(dto: CreateLifestyleDto, requesterId: number) {
    this.logger.log(`Adding lifestyle detail for patient ${dto.patientId} by user ${requesterId}`);
    
    await this.validateAccess(dto.patientId, requesterId);

    return this.prisma.lifestyleDetail.create({
      data: {
        patientId: BigInt(dto.patientId),
        diet: dto.diet,
        sleepHours: dto.sleepHours,
        stressLevel: dto.stressLevel,
        activityType: dto.activityType,
        activityFreq: dto.activityFreq,
        tobacco: dto.tobacco,
        alcohol: dto.alcohol,
      },
    });
  }

  async findLifestyle(patientId: number, requesterId: number) {
    await this.validateAccess(patientId, requesterId);

    return this.prisma.lifestyleDetail.findFirst({
      where: { patientId: BigInt(patientId) },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async updateLifestyle(
    id: number,
    dto: UpdateLifestyleDto,
    requesterId: number
  ) {
    const existing = await this.prisma.lifestyleDetail.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existing) {
      throw new NotFoundException(`Lifestyle record ${id} not found`);
    }

    await this.validateAccess(Number(existing.patientId), requesterId);

    return this.prisma.lifestyleDetail.update({
      where: { id: BigInt(id) },
      data: {
        diet: dto.diet,
        sleepHours: dto.sleepHours,
        stressLevel: dto.stressLevel,
        activityType: dto.activityType,
        activityFreq: dto.activityFreq,
        tobacco: dto.tobacco,
        alcohol: dto.alcohol,
      },
    });
  }

  async removeLifestyle(id: number, requesterId: number) {
    const existing = await this.prisma.lifestyleDetail.findUnique({
      where: { id: BigInt(id) },
    });

    if (!existing) {
      throw new NotFoundException(`Lifestyle record ${id} not found`);
    }

    await this.validateAccess(Number(existing.patientId), requesterId);

    return this.prisma.lifestyleDetail.delete({
      where: { id: BigInt(id) },
    });
  }

  // ===========================
  // Full History (Composite)
  // ===========================

  async getFullHistory(
    patientId: number,
    requesterId: number
  ): Promise<FullHistoryResponse> {
    this.logger.log(`Fetching full history for patient ${patientId} by user ${requesterId}`);

    // Check access and get permissions
    const permissions = await this.checkAndGetPermissions(patientId, requesterId);

    // Build where clause for medical history based on permissions
    const historyWhere: any = { patientId: BigInt(patientId) };

    if (permissions !== null) {
      const allowedTypes: string[] = [];
      if (permissions.fisico) allowedTypes.push('fisico');
      if (permissions.mental) allowedTypes.push('mental');

      if (allowedTypes.length === 0) {
        throw new ForbiddenException('You do not have permission to view any medical records');
      }

      historyWhere.type = { in: allowedTypes };
    }

    // Fetch all data in parallel for performance
    const [history, allergies, medications, familyHistory, lifestyle] =
      await Promise.all([
        this.prisma.medicalHistory.findMany({
          where: historyWhere,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.allergy.findMany({
          where: { patientId: BigInt(patientId) },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.medication.findMany({
          where: { patientId: BigInt(patientId) },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.familyHistory.findMany({
          where: { patientId: BigInt(patientId) },
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.lifestyleDetail.findFirst({
          where: { patientId: BigInt(patientId) },
          orderBy: { updatedAt: 'desc' },
        }),
      ]);

    return {
      history,
      allergies,
      medications,
      familyHistory,
      lifestyle,
    };
  }
}
