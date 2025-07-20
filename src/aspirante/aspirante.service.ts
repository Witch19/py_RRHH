import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aspirante } from './entities/aspirante.entity';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';

@Injectable()
export class AspiranteService {
  constructor(
    @InjectRepository(Aspirante)
    private readonly repo: Repository<Aspirante>,
    @InjectRepository(TipoTrabajo)
    private readonly tipoRepo: Repository<TipoTrabajo>,
  ) {}

  async create(data, filename: string) {
    const tipoTrabajo = await this.tipoRepo.findOneBy({ id: Number(data.tipoTrabajoId) });

    if (!tipoTrabajo) {
      throw new NotFoundException('Tipo de trabajo no encontrado');
    }

    const aspirante = this.repo.create({
      nombre: data.nombre,
      email: data.email,
      mensaje: data.mensaje,
      tipoTrabajo,
      cvUrl: filename ? `/public/uploads/cv/${filename}` : undefined,
    });

    return this.repo.save(aspirante);
  }

  findAll() {
    return this.repo.find({
      relations: ['tipoTrabajo'], // ✅ importante para que se muestre el nombre
    });
  }
}
