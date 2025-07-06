import { Injectable, NotFoundException } from '@nestjs/common';
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

  create(createDto: CreateTipoTrabajoDto) {
    const tipoTrabajo = this.tipoTrabajoRepository.create(createDto);
    return this.tipoTrabajoRepository.save(tipoTrabajo);
  }

  findAll() {
    return this.tipoTrabajoRepository.find();
  }

  findOne(id: number) {
    return this.tipoTrabajoRepository.findOneBy({ id });
  }

  async update(id: number, updateDto: UpdateTipoTrabajoDto) {
    const tipoTrabajo = await this.tipoTrabajoRepository.findOneBy({ id });
    if (!tipoTrabajo) {
      throw new NotFoundException(`TipoTrabajo con id ${id} no encontrado`);
    }
    Object.assign(tipoTrabajo, updateDto);
    return this.tipoTrabajoRepository.save(tipoTrabajo);
  }

  async remove(id: number) {
    const result = await this.tipoTrabajoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TipoTrabajo con id ${id} no encontrado`);
    }
    return result;
  }
}
