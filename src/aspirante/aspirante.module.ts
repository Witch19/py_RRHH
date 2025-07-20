import { Module } from '@nestjs/common';
import { AspiranteService } from './aspirante.service';
import { AspiranteController } from './aspirante.controller';
import { Aspirante } from './entities/aspirante.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Aspirante])],
  controllers: [AspiranteController],
  providers: [AspiranteService],
})
export class AspiranteModule {}
