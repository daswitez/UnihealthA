import { IsNumber, IsString, IsOptional, IsDateString, IsIn, Length } from 'class-validator';

export class CreateMedicalHistoryDto {
  @IsNumber()
  patientId: number;

  @IsString()
  @Length(1, 255)
  condition: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;

  @IsOptional()
  @IsString()
  treatment?: string;

  @IsOptional()
  @IsDateString()
  diagnosedAt?: string;

  @IsIn(['fisico', 'mental'], { message: 'Type must be either "fisico" or "mental"' })
  type: 'fisico' | 'mental';

  @IsOptional()
  @IsString()
  notes?: string;
}
