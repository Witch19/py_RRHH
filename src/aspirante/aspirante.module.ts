// src/aspirante/aspirante.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aspirante } from './entities/aspirante.entity';
import { AspiranteService } from './aspirante.service';
import { AspiranteController } from './aspirante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aspirante])],
  providers: [AspiranteService],
  controllers: [AspiranteController],
})
export class AspiranteModule {}
