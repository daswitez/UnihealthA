import { PartialType } from '@nestjs/mapped-types';
import { CreateLifestyleDto } from './create-lifestyle.dto';

export class UpdateLifestyleDto extends PartialType(CreateLifestyleDto) {}
