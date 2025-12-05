import { IsNotEmpty, IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsNumber()
  patientId: number;

  @IsNumber()
  nurseId: number;

  @IsNumber()
  serviceTypeId: number;

  @IsNumber()
  @IsOptional()
  kioskId?: number;

  @IsDateString()
  start: string;

  @IsDateString()
  end: string;

  @IsOptional()
  @IsString()
  reason?: string;
}

