// src/curso/curso.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Curso } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Trabajador } from '../trabajador/entities/trabajador.entity';

@Injectable()
export class CursoService {
  constructor(
    @InjectRepository(Curso)
    private readonly repo: Repository<Curso>,
    @InjectRepository(Trabajador)
    private readonly trabRepo: Repository<Trabajador>,
  ) {}

  create(dto: CreateCursoDto) {
    const curso = this.repo.create(dto);
    return this.repo.save(curso);
  }

  findAll() {
    return this.repo.find({ relations: ['trabajadores'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['trabajadores'] });
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

  async inscribir(cursoId: number, trabajadorId: number) {
    const curso = await this.repo.findOne({
      where: { id: cursoId },
      relations: ['trabajadores'],
    });
    if (!curso) throw new NotFoundException('Curso no encontrado');

    const trabajador = await this.trabRepo.findOneBy({ id: trabajadorId });
    if (!trabajador)
      throw new NotFoundException('Trabajador no encontrado');

    const yaInscrito = curso.trabajadores.some((t) => t.id === trabajadorId);
    if (yaInscrito)
      throw new ConflictException('Ya estás inscrito en este curso');

    curso.trabajadores.push(trabajador);
    return this.repo.save(curso);
  }
}
