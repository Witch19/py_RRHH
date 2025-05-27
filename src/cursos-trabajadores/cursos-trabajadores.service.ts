import { Injectable } from '@nestjs/common';
import { CreateCursosTrabajadoreDto } from './dto/create-cursos-trabajadore.dto';
import { UpdateCursosTrabajadoreDto } from './dto/update-cursos-trabajadore.dto';

@Injectable()
export class CursosTrabajadoresService {
  create(createCursosTrabajadoreDto: CreateCursosTrabajadoreDto) {
    return 'This action adds a new cursosTrabajadore';
  }

  findAll() {
    return `This action returns all cursosTrabajadores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cursosTrabajadore`;
  }

  update(id: number, updateCursosTrabajadoreDto: UpdateCursosTrabajadoreDto) {
    return `This action updates a #${id} cursosTrabajadore`;
  }

  remove(id: number) {
    return `This action removes a #${id} cursosTrabajadore`;
  }
}
