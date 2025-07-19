import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Trabajador } from './entities/trabajador.entity';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';

@Injectable()
export class TrabajadorService {
  constructor(
    @InjectRepository(Trabajador)
    private readonly trabajadorRepository: Repository<Trabajador>,
    @InjectRepository(TipoTrabajo)
    private readonly tipoTrabajoRepository: Repository<TipoTrabajo>,
  ) {}

  /* ───────── Crear ───────── */
  async create(dto: CreateTrabajadorDto) {
    const tipoTrabajo = await this.tipoTrabajoRepository.findOneBy({
      id: dto.tipoTrabajoId,
    });
    if (!tipoTrabajo) {
      throw new NotFoundException('Tipo de trabajo no encontrado');
    }

    const password = dto.password || 'temporal123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const trabajador = this.trabajadorRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      role: (dto.role ?? 'TRABAJADOR').toUpperCase(),
      telefono: dto.telefono,
      direccion: dto.direccion,
      cvUrl: dto.cvUrl,
      tipoTrabajo,
      tipoTrabajoId: tipoTrabajo.id,
      tipoTrabajador: dto.tipoTrabajador,
    });

    return await this.trabajadorRepository.save(trabajador);
  }

  /* ───────── Obtener ───────── */
  findAll() {
    return this.trabajadorRepository.find({
      relations: ['tipoTrabajo', 'cursos'],
    });
  }

  async findOne(id: number) {
    const trabajador = await this.trabajadorRepository.findOne({
      where: { id },
      relations: ['tipoTrabajo', 'cursos'],
    });
    if (!trabajador) {
      throw new NotFoundException('Trabajador no encontrado');
    }
    return trabajador;
  }

  /* ───────── Actualizar ───────── */
  async update(id: number, dto: UpdateTrabajadorDto) {
    const trabajador = await this.trabajadorRepository.findOne({
      where: { id },
      relations: ['tipoTrabajo'],
    });
    if (!trabajador) {
      throw new NotFoundException('Trabajador no encontrado');
    }

    if (dto.tipoTrabajoId) {
      const tipoTrabajo = await this.tipoTrabajoRepository.findOneBy({
        id: dto.tipoTrabajoId,
      });
      if (!tipoTrabajo) {
        throw new NotFoundException('Tipo de trabajo no encontrado');
      }
      trabajador.tipoTrabajo = tipoTrabajo;
      trabajador.tipoTrabajoId = tipoTrabajo.id;
    }

    if (dto.tipoTrabajador) {
      trabajador.tipoTrabajador = dto.tipoTrabajador;
    }

    const { password, tipoTrabajoId, tipoTrabajador, ...rest } = dto;
    Object.assign(trabajador, rest);

    await this.trabajadorRepository.save(trabajador);
    return this.findOne(id);
  }

  /* ───────── Eliminar ───────── */
  async remove(id: number) {
    const { affected } = await this.trabajadorRepository.delete(id);
    if (!affected) {
      throw new NotFoundException('Trabajador no encontrado');
    }
    return { message: 'Trabajador eliminado' };
  }
}
