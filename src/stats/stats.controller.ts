import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get('summary')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  getSummary() {
    return this.statsService.getSummary();
  }
}