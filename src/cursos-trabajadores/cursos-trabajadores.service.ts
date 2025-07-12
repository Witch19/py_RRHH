import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursosTrabajadores } from './entities/cursos-trabajadores.entity';
import { CreateCursosTrabajadoresDto } from './dto/create-cursos-trabajadores.dto';
import { UpdateCursosTrabajadoresDto } from './dto/update-cursos-trabajadores.dto';
import { Trabajador } from '../trabajador/entities/trabajador.entity';
import { Curso } from '../curso/entities/curso.entity';

@Injectable()
export class CursosTrabajadoresService {
  constructor(
    @InjectRepository(CursosTrabajadores)
    private readonly repo: Repository<CursosTrabajadores>,

    @InjectRepository(Trabajador)
    private readonly trabajadorRepo: Repository<Trabajador>,

    @InjectRepository(Curso)
    private readonly cursoRepo: Repository<Curso>,
  ) {}

  async create(dto: CreateCursosTrabajadoresDto) {
    // Validar existencia de trabajador
    const trabajador = await this.trabajadorRepo.findOneBy({ id: dto.trabajadorId });
    if (!trabajador) {
      throw new NotFoundException(`Trabajador con id ${dto.trabajadorId} no encontrado`);
    }

    // Validar existencia de curso
    const curso = await this.cursoRepo.findOneBy({ id: dto.cursoId });
    if (!curso) {
      throw new NotFoundException(`Curso con id ${dto.cursoId} no encontrado`);
    }

    const nuevaRelacion = this.repo.create({
      trabajador,
      curso,
      fechaRealizacion: dto.fechaRealizacion,
      aprobado: dto.aprobado,
    });

    return this.repo.save(nuevaRelacion);
  }

  findAll() {
    return this.repo.find({ relations: ['trabajador', 'curso'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['trabajador', 'curso'] });
  }

  async update(id: number, dto: UpdateCursosTrabajadoresDto) {
    const registro = await this.repo.findOneBy({ id });
    if (!registro) throw new NotFoundException('Registro no encontrado');

    // Opcional: validar si actualizan trabajadorId o cursoId y cargar las entidades correspondientes

    Object.assign(registro, dto);
    return this.repo.save(registro);
  }

  async remove(id: number) {
    const registro = await this.repo.findOneBy({ id });
    if (!registro) throw new NotFoundException('Registro no encontrado');
    return this.repo.remove(registro);
  }
}