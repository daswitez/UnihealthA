import { IsNumber, IsOptional } from 'class-validator';

export class CreateVitalDto {
  @IsNumber()
  patientId: number;

  @IsNumber()
  @IsOptional()
  systolicBP?: number;

  @IsNumber()
  @IsOptional()
  diastolicBP?: number;

  @IsNumber()
  @IsOptional()
  heartRate?: number;

  @IsNumber()
  @IsOptional()
  tempC?: number;

  @IsNumber()
  @IsOptional()
  spo2?: number;
}
