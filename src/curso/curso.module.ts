// src/curso/curso.module.ts
import { Module } from '@nestjs/common';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { Trabajador } from '../trabajador/entities/trabajador.entity'; // ✅
import { TrabajadorModule } from '../trabajador/trabajador.module'; // ✅

@Module({
  imports: [
    TypeOrmModule.forFeature([Curso, Trabajador]), // ✅ incluye ambos repos
    TrabajadorModule, // ✅ importa el módulo completo
  ],
  controllers: [CursoController],
  providers: [CursoService],
})
export class CursoModule {}
