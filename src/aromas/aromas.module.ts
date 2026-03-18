import { Module } from '@nestjs/common';
import { AromasService } from './aromas.service';
import { AromasController } from './aromas.controller';

@Module({
  controllers: [AromasController],
  providers: [AromasService],
})
export class AromasModule {}