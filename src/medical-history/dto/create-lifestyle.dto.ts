import { IsNumber, IsString, IsOptional, IsInt, Min, Max, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLifestyleDto {
  @IsNumber()
  patientId: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  diet?: string;

  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @Max(24)
  sleepHours?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10)
  stressLevel?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  activityType?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  activityFreq?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  tobacco?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  alcohol?: string;
}
