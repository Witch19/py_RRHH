import { Module } from '@nestjs/common';
import { CursosTrabajadoresService } from './cursos-trabajadores.service';
import { CursosTrabajadoresController } from './cursos-trabajadores.controller';

@Module({
  controllers: [CursosTrabajadoresController],
  providers: [CursosTrabajadoresService],
})
export class CursosTrabajadoresModule {}
