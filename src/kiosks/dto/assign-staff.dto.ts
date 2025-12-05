import { IsNumber } from 'class-validator';

export class AssignStaffDto {
  @IsNumber()
  userId: number;
}
