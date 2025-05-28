import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrabajadorService } from './trabajador.service';
import { TrabajadorController } from './trabajador.controller';
import { Trabajador } from './entities/trabajador.entity';
import { TipoTrabajoModule } from '../tipo-trabajo/tipo-trabajo.module'; // importa el módulo correcto

@Module({
  imports: [
    TypeOrmModule.forFeature([Trabajador]),
    TipoTrabajoModule,  
  ],
  providers: [TrabajadorService],
  controllers: [TrabajadorController],
})
export class TrabajadorModule {}
