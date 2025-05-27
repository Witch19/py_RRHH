import { Module } from '@nestjs/common';
import { TrabajadorService } from './trabajador.service';
import { TrabajadorController } from './trabajador.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trabajador } from './entities/trabajador.entity';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trabajador, TipoTrabajo])],
  controllers: [TrabajadorController],
  providers: [TrabajadorService],
})
export class TrabajadorModule {}
