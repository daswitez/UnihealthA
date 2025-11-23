import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDecimal } from 'class-validator';

export class CreateAlertDto {
  @IsNumber()
  patientId: number;

  @IsNumber()
  typeId: number;

  @IsOptional()
  @IsDecimal()
  latitude?: number;

  @IsOptional()
  @IsDecimal()
  longitude?: number;

  @IsOptional()
  @IsString()
  description?: string;
}
