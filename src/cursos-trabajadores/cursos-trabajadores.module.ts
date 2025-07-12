import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CursosTrabajadoresService } from './cursos-trabajadores.service';
import { CursosTrabajadoresController } from './cursos-trabajadores.controller';
import { CursosTrabajadores } from './entities/cursos-trabajadores.entity';
import { Trabajador } from 'src/trabajador/entities/trabajador.entity';
import { Curso } from 'src/curso/entities/curso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CursosTrabajadores, Trabajador, Curso]),
  ],
  controllers: [CursosTrabajadoresController],
  providers: [CursosTrabajadoresService],
})
export class CursosTrabajadoresModule {}
