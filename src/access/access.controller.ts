import { Controller, Post, Body, UseGuards, Request, Get, Param, Delete } from '@nestjs/common';
import { AccessService } from './access.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('access')
export class AccessController {
  constructor(private readonly accessService: AccessService) {}

  @Post('grant')
  grantAccess(@Request() req, @Body() body: { doctorId: number; pin: string; permissions: any }) {
    return this.accessService.grantAccess(req.user.userId, body.doctorId, body.pin, body.permissions);
  }

  @Post('revoke')
  revokeAccess(@Request() req, @Body() body: { doctorId: number }) {
    return this.accessService.revokeAccess(req.user.userId, body.doctorId);
  }

  @Get('check/:patientId')
  checkAccess(@Request() req, @Param('patientId') patientId: string) {
    // Check if I (the doctor) have access to patientId
    return this.accessService.checkAccess(+patientId, req.user.userId);
  }
}
