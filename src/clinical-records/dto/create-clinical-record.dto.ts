import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateClinicalRecordDto {
  @IsNumber()
  patientId: number;

  @IsNumber()
  noteTypeId: number;

  @IsString()
  @IsOptional()
  note?: string;
}
