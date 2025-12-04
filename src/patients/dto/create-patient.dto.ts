import { IsString, IsOptional, IsEmail, IsDateString, Length, IsNumber, IsBoolean, IsObject, Min, Max } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  firstName: string;
  
  @IsString()
  lastName: string;
  
  @IsEmail()
  @IsOptional()
  email?: string;
  
  @IsString()
  @IsOptional()
  phone?: string;
  
  @IsDateString()
  dob: string; // Recibiremos fecha como string ISO
  
  @IsString()
  @Length(1, 1, { message: 'Gender must be a single character (M/F/O)' })
  gender: string;

  @IsString()
  @IsOptional()
  bloodGroup?: string; // e.g., "A+", "O-", etc.

  @IsNumber()
  @Min(0)
  @Max(300)
  @IsOptional()
  heightCm?: number;

  @IsNumber()
  @Min(0)
  @Max(500)
  @IsOptional()
  weightKg?: number;

  @IsObject()
  @IsOptional()
  insurance?: any; // JSON object for insurance details

  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @IsBoolean()
  @IsOptional()
  isSmoker?: boolean;

  @IsString()
  @IsOptional()
  alcohol?: string; // e.g., "nunca", "ocasional", "frecuente"

  @IsString()
  @IsOptional()
  activity?: string; // physical activity level

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  history?: string;
}
