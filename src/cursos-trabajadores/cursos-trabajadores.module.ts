import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosTrabajadoresService } from './cursos-trabajadores.service';
import { CursosTrabajadoresController } from './cursos-trabajadores.controller';
import { CursosTrabajadore } from './entities/cursos-trabajador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CursosTrabajadore])],
  controllers: [CursosTrabajadoresController],
  providers: [CursosTrabajadoresService],
})
export class CursosTrabajadoresModule {}
