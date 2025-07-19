import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrabajadorService } from './trabajador.service';
import { TrabajadorController } from './trabajador.controller';
import { Trabajador } from './entities/trabajador.entity';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';
import { TipoTrabajoModule } from '../tipo-trabajo/tipo-trabajo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trabajador, TipoTrabajo]), // ✅ ← TipoTrabajo agregado
    TipoTrabajoModule,
  ],
  providers: [TrabajadorService],
  controllers: [TrabajadorController],
})
export class TrabajadorModule {}
