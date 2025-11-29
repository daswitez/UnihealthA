import { IsNumber, IsString, IsOptional, Length } from 'class-validator';

export class CreateFamilyHistoryDto {
  @IsNumber()
  patientId: number;

  @IsString()
  @Length(1, 50)
  relationship: string;

  @IsString()
  @Length(1, 255)
  condition: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
