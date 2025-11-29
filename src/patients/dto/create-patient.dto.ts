import { IsString, IsOptional, IsEmail, IsDateString, Length } from 'class-validator';

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
}
