import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trabajador } from './entities/trabajador.entity';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';

@Injectable()
export class TrabajadorService {
  tipoTrabajoRepo: any;
  trabajadorRepo: any;
  constructor(
    @InjectRepository(Trabajador)
    private trabajadorRepository: Repository<Trabajador>,

    @InjectRepository(TipoTrabajo)
    private tipoTrabajoRepository: Repository<TipoTrabajo>,
  ) {}

  async create(dto: CreateTrabajadorDto) {
    const tipoTrabajo = await this.tipoTrabajoRepo.findOneBy({ id: dto.tipoTrabajoId });
    const trabajador = this.trabajadorRepo.create({
      nombre: dto.nombre,
      apellido: dto.apellido,
      email: dto.email,
      tipoTrabajo,
    });
    return this.trabajadorRepo.save(trabajador);
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
      const tipoTrabajo = await this.tipoTrabajoRepo.findOneBy({ id: dto.tipoTrabajoId });
      trabajador.tipoTrabajo = tipoTrabajo;
    }
    

    Object.assign(trabajador, dto);
    return this.trabajadorRepository.save(trabajador);
  }

  remove(id: number) {
    return this.trabajadorRepository.delete(id);
  }
}
