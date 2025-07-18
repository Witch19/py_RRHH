import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoTrabajo } from './entities/tipo-trabajo.entity';
import { CreateTipoTrabajoDto } from './dto/create-tipo-trabajo.dto';
import { UpdateTipoTrabajoDto } from './dto/update-tipo-trabajo.dto';

@Injectable()
export class TipoTrabajoService {
  constructor(
    @InjectRepository(TipoTrabajo)
    private readonly tipoTrabajoRepository: Repository<TipoTrabajo>,
  ) {}

  /* ───────────── CREAR ───────────── */
  async create(createDto: CreateTipoTrabajoDto) {
    const exists = await this.tipoTrabajoRepository.findOneBy({ nombre: createDto.nombre });
    if (exists) {
      throw new ConflictException('Ya existe un tipo de trabajo con ese nombre');
    }

    const tipoTrabajo = this.tipoTrabajoRepository.create(createDto);
    return this.tipoTrabajoRepository.save(tipoTrabajo);
  }

  /* ───────────── LISTAR ───────────── */
  findAll() {
    return this.tipoTrabajoRepository.find();
  }

  /* ───── ENUM para frontend (opcional) ───── */
  async findAllEnum() {
    const tipos = await this.tipoTrabajoRepository.find();
    return tipos.map(tipo => ({ key: tipo.id.toString(), value: tipo.nombre }));
  }

  /* ───────────── DETALLE ───────────── */
  async findOne(id: number) {
    const tipoTrabajo = await this.tipoTrabajoRepository.findOneBy({ id });
    if (!tipoTrabajo) {
      throw new NotFoundException(`TipoTrabajo con id ${id} no encontrado`);
    }
    return tipoTrabajo;
  }

  /* ───────────── ACTUALIZAR ───────────── */
  async update(id: number, updateDto: UpdateTipoTrabajoDto) {
    const tipoTrabajo = await this.findOne(id);
    Object.assign(tipoTrabajo, updateDto);
    return this.tipoTrabajoRepository.save(tipoTrabajo);
  }

  /* ───────────── ELIMINAR ───────────── */
  async remove(id: number) {
    const result = await this.tipoTrabajoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TipoTrabajo con id ${id} no encontrado`);
    }
    return { message: 'TipoTrabajo eliminado' };
  }
}
