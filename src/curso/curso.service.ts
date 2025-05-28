import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly repo: Repository<Curso>,
  ) {}

  create(dto: CreateCursoDto) {
    const curso = this.repo.create(dto);
    return this.repo.save(curso);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateCursoDto) {
    const curso = await this.repo.findOneBy({ id });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    Object.assign(curso, dto);
    return this.repo.save(curso);
  }

  async remove(id: number) {
    const curso = await this.repo.findOneBy({ id });
    if (!curso) throw new NotFoundException('Curso no encontrado');
    return this.repo.remove(curso);
  }
}
