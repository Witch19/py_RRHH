import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursosTrabajadoresService } from './cursos-trabajadores.service';
import { CursosTrabajadoresController } from './cursos-trabajadores.controller';
import { CursosTrabajadores } from './entities/cursos-trabajadores.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CursosTrabajadores])],
  controllers: [CursosTrabajadoresController],
  providers: [CursosTrabajadoresService],
})
export class CursosTrabajadoresModule {}
