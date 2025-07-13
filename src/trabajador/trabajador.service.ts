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

  /* ------------------------------------------------------------------ */
  /* CREATE                                                             */
  /* ------------------------------------------------------------------ */
  async create(dto: CreateTrabajadorDto) {
    const tipoTrabajo = await this.tipoTrabajoRepository.findOneBy({
      id: dto.tipoTrabajoId,
    });
    if (!tipoTrabajo) throw new NotFoundException('Tipo de trabajo no encontrado');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const trabajador = this.trabajadorRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      password: hashedPassword,
      role: (dto.role ?? 'TRABAJADOR').toUpperCase(), // normalizamos
      tipoTrabajo,
    });

    try {
      return await this.trabajadorRepository.save(trabajador);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Este email ya está registrado');
      }
      throw error;
    }
  }

  /* ------------------------------------------------------------------ */
  /* READ                                                               */
  /* ------------------------------------------------------------------ */
  findAll() {
    return this.trabajadorRepository.find({ relations: ['tipoTrabajo'] });
  }

  async findOne(id: number) {
    const trabajador = await this.trabajadorRepository.findOne({
      where: { id },
      relations: ['tipoTrabajo'],
    });
    if (!trabajador) throw new NotFoundException('Trabajador no encontrado');
    return trabajador;
  }

  /* ------------------------------------------------------------------ */
  /* UPDATE                                                             */
  /* ------------------------------------------------------------------ */
  async update(id: number, dto: UpdateTrabajadorDto) {
    const trabajador = await this.trabajadorRepository.findOne({
      where: { id },
      relations: ['tipoTrabajo'],
    });
    if (!trabajador) throw new NotFoundException('Trabajador no encontrado');

    /* tipoTrabajo opcional */
    if (dto.tipoTrabajoId) {
      const tipoTrabajo = await this.tipoTrabajoRepository.findOneBy({
        id: dto.tipoTrabajoId,
      });
      if (!tipoTrabajo) throw new NotFoundException('Tipo de trabajo no encontrado');
      trabajador.tipoTrabajo = tipoTrabajo;
    }

    /* password opcional */
    if (dto.password) {
      trabajador.password = await bcrypt.hash(dto.password, 10);
    }

    /* otros campos */
    const { password, tipoTrabajoId, ...rest } = dto;
    Object.assign(trabajador, rest);

    await this.trabajadorRepository.save(trabajador);
    return this.findOne(id); // retorna datos actualizados
  }

  /* ------------------------------------------------------------------ */
  /* DELETE                                                             */
  /* ------------------------------------------------------------------ */
  async remove(id: number) {
    const { affected } = await this.trabajadorRepository.delete(id);
    if (!affected) throw new NotFoundException('Trabajador no encontrado');
    return { message: 'Trabajador eliminado' };
  }
}
