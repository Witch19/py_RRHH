import { Module } from '@nestjs/common';
import { AspiranteService } from './aspirante.service';
import { AspiranteController } from './aspirante.controller';

@Module({
  controllers: [AspiranteController],
  providers: [AspiranteService],
})
export class AspiranteModule {}
