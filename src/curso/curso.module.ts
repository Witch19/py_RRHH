import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoService } from './curso.service';
import { CursoController } from './curso.controller';
import { Curso } from './entities/curso.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Curso])],
  controllers: [CursoController],
  providers: [CursoService],
  exports: [TypeOrmModule], // para que cursos-trabajadores lo pueda importar
})
export class CursoModule {}
