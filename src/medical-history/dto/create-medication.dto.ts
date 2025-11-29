import { IsNumber, IsString, IsOptional, IsDateString, IsBoolean, Length } from 'class-validator';

export class CreateMedicationDto {
  @IsNumber()
  patientId: number;

  @IsString()
  @Length(1, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  dosage?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  frequency?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
