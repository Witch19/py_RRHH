import { Module } from '@nestjs/common';
import { EducacionService } from './educacion.service';
import { EducacionController } from './educacion.controller';

@Module({
  controllers: [EducacionController],
  providers: [EducacionService],
})
export class EducacionModule {}
