import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ParametersService } from './parameters.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('parameters')
export class ParametersController {
  constructor(private readonly parametersService: ParametersService) {}

  @Get()
  findAll() {
    return this.parametersService.findAll();
  }

  @Get(':key')
  findOne(@Param('key') key: string) {
    return this.parametersService.findOne(key);
  }

  @Patch(':key')
  update(@Param('key') key: string, @Body('value') value: string) {
    return this.parametersService.update(key, value);
  }
}
