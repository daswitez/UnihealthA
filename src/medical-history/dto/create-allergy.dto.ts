import { IsNumber, IsString, IsOptional, Length, IsIn } from 'class-validator';

export class CreateAllergyDto {
  @IsNumber()
  patientId: number;

  @IsString()
  @Length(1, 255)
  allergen: string;

  @IsOptional()
  @IsString()
  reaction?: string;

  @IsOptional()
  @IsIn(['mild', 'moderate', 'severe'], { 
    message: 'Severity must be mild, moderate, or severe' 
  })
  severity?: 'mild' | 'moderate' | 'severe';

  @IsOptional()
  @IsString()
  notes?: string;
}
