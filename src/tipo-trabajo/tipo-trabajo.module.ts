import { Module } from '@nestjs/common';
import { TipoTrabajoService } from './tipo-trabajo.service';
import { TipoTrabajoController } from './tipo-trabajo.controller';

@Module({
  controllers: [TipoTrabajoController],
  providers: [TipoTrabajoService],
})
export class TipoTrabajoModule {}
