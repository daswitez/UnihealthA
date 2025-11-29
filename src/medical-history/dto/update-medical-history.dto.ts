import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicalHistoryDto } from './create-medical-history.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateMedicalHistoryDto extends PartialType(CreateMedicalHistoryDto) {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
