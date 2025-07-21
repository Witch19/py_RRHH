// src/cursos-trabajadores/cursos-trabajadores.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursosTrabajadores } from './entities/cursos-trabajadores.entity';
import { CreateCursosTrabajadoresDto } from './dto/create-cursos-trabajadores.dto';
import { UpdateCursosTrabajadoresDto } from './dto/update-cursos-trabajadores.dto';
import { InscribirDto } from './dto/inscripcion.dto';
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

  /* ────────────────────────────
     Helpers
  ──────────────────────────── */
  /** Trae una inscripción con sus relaciones */
  async findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['trabajador', 'curso'],
    });
  }

  /* ────────────────────────────
     ADMIN / SUPERVISOR: alta manual
  ──────────────────────────── */
  async create(dto: CreateCursosTrabajadoresDto) {
    return this._crearRelacion(
      dto.trabajadorId,
      dto.cursoId,
      dto.fechaRealizacion,
      dto.aprobado,
    );
  }

  /* ────────────────────────────
     Trabajador: inscribirse él mismo
  ──────────────────────────── */
  async inscribir(dto: InscribirDto) {
    // Siempre aprobado = false al inscribirse
    return this._crearRelacion(
      dto.trabajadorId,
      dto.cursoId,
      dto.fechaRealizacion,
      false,
    );
  }

  /* ────────────────────────────
     Crear relación (uso compartido)
  ──────────────────────────── */
  private async _crearRelacion(
    trabajadorId: number,
    cursoId: number,
    fechaRealizacion?: string,
    aprobado = false,
  ) {
    // Validar trabajador
    const trabajador = await this.trabajadorRepo.findOneBy({ id: trabajadorId });
    if (!trabajador) {
      throw new NotFoundException(`Trabajador con id ${trabajadorId} no encontrado`);
    }

    // Validar curso
    const curso = await this.cursoRepo.findOneBy({ id: cursoId });
    if (!curso) {
      throw new NotFoundException(`Curso con id ${cursoId} no encontrado`);
    }

    // Evitar duplicados
    const yaInscrito = await this.repo.findOne({
      where: { trabajador: { id: trabajadorId }, curso: { id: cursoId } },
    });
    if (yaInscrito) {
      throw new BadRequestException('Ya estás inscrito en este curso');
    }

    const nuevaRelacion = this.repo.create({
      trabajador,
      curso,
      fechaRealizacion: fechaRealizacion ?? new Date().toISOString().split('T')[0],
      aprobado,
    });

    return this.repo.save(nuevaRelacion);
  }

  /* ────────────────────────────
     Lecturas
  ──────────────────────────── */
  async findAll() {
    const relaciones = await this.repo.find({
      relations: {
        curso: true,
        trabajador: true,
      },
    });

    return relaciones.map((rel) => ({
      id: rel.id,
      fechaRealizacion: rel.fechaRealizacion,
      aprobado: rel.aprobado,
      curso: {
        id: rel.curso.id,
        nombre: rel.curso.nombre,
        descripcion: rel.curso.descripcion,
        duracion: rel.curso.duracion,
        areas: rel.curso.areas,
      },
      trabajador: {
        id: rel.trabajador.id,
        nombre: rel.trabajador.nombre,
        apellido: rel.trabajador.apellido,
        email: rel.trabajador.email, // ✅ email incluido
      },
    }));
  }

  findOne(id: number) {
    return this.findById(id);
  }

  /* ────────────────────────────
     Actualización
  ──────────────────────────── */
  async update(id: number, dto: UpdateCursosTrabajadoresDto) {
    const registro = await this.findById(id);
    if (!registro) throw new NotFoundException('Registro no encontrado');

    Object.assign(registro, dto);
    return this.repo.save(registro);
  }

  /* ────────────────────────────
     Eliminación
  ──────────────────────────── */
  async remove(id: number) {
    const registro = await this.findById(id);
    if (!registro) throw new NotFoundException('Registro no encontrado');
    return this.repo.remove(registro);
  }
}