import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trabajador } from './entities/trabajador.entity';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class TrabajadorService {
  constructor(
    @InjectRepository(Trabajador)
    private trabajadorRepository: Repository<Trabajador>,

    @InjectRepository(TipoTrabajo)
    private tipoTrabajoRepository: Repository<TipoTrabajo>,
  ) { }

  async create(dto: CreateTrabajadorDto) {
    console.log('tipoTrabajoId recibido:', dto.tipoTrabajoId);

    // Buscar el tipo de trabajo
    const tipoTrabajo = await this.tipoTrabajoRepository.findOneBy({
      id: dto.tipoTrabajoId,
    });

    if (!tipoTrabajo) {
      throw new Error('Tipo de trabajo no encontrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear entidad trabajador
    const trabajador = this.trabajadorRepository.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      password: hashedPassword,
      role: dto.role ?? 'trabajador',
      tipoTrabajo: tipoTrabajo,
    });

    // Guardar y capturar errores si el email ya existe
    try {
      return await this.trabajadorRepository.save(trabajador);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Este email ya está registrado');
      }
      throw error; // otros errores inesperados
    }
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

    // Si viene nueva contraseña, la encripta
    if (dto.password) {
      trabajador.password = await bcrypt.hash(dto.password, 10);
    }

    // Excluye password del assign si ya se procesó antes
    const { password, tipoTrabajoId, ...resto } = dto;
    Object.assign(trabajador, resto);

    return this.trabajadorRepository.save(trabajador);
  }


  remove(id: number) {
    return this.trabajadorRepository.delete(id);
  }
}
