import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trabajador } from './entities/trabajador.entity';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TrabajadorService {
  constructor(
    @InjectRepository(Trabajador)
    private trabajadorRepository: Repository<Trabajador>,

    @InjectRepository(TipoTrabajo)
    private tipoTrabajoRepository: Repository<TipoTrabajo>,
  ) {}

  async create(dto: CreateTrabajadorDto) {
    console.log('tipoTrabajoId recibido:', dto.tipoTrabajoId);
    const tipoTrabajo = await this.tipoTrabajoRepository.findOneBy({ id: dto.tipoTrabajoId });

    if (!tipoTrabajo) {
      throw new Error('Tipo de trabajo no encontrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const trabajador = this.trabajadorRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? 'trabajador', // Valor por defecto si no viene role
      tipoTrabajo: tipoTrabajo,
    });

    return this.trabajadorRepository.save(trabajador);
  }

  findAll() {
    return this.trabajadorRepository.find({ relations: ['tipoTrabajo'] });
  }

  findOne(id: number) {
    return this.trabajadorRepository.findOne({ where: { id }, relations: ['tipoTrabajo'] });
  }

  async update(id: number, dto: UpdateTrabajadorDto) {
    const trabajador = await this.trabajadorRepository.findOneBy({ id });
    if (!trabajador) return null;

    if (dto.tipoTrabajoId) {
      const tipoTrabajo = await this.tipoTrabajoRepository.findOneBy({ id: dto.tipoTrabajoId });

      if (!tipoTrabajo) {
        throw new NotFoundException('Tipo de trabajo no encontrado');
      }

      trabajador.tipoTrabajo = tipoTrabajo;
    }

    if (dto.password) {
      trabajador.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(trabajador, dto);
    return this.trabajadorRepository.save(trabajador);
  }

  remove(id: number) {
    return this.trabajadorRepository.delete(id);
  }
}
