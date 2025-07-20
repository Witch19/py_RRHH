import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aspirante } from './entities/aspirante.entity';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';
import * as fs from 'fs';

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
      cvUrl: filename ? `${filename}` : undefined, // Solo el nombre del archivo
    });

    return this.repo.save(aspirante);
  }

  findAll() {
    return this.repo.find({
      relations: ['tipoTrabajo'],
    });
  }

  async remove(id: string) {
    const aspirante = await this.repo.findOne({
      where: { id: parseInt(id) },
    });

    if (!aspirante) {
      throw new NotFoundException('Aspirante no encontrado');
    }

    // Eliminar archivo si existe
    if (aspirante.cvUrl) {
      const filePath = `./public/uploads/cv/${aspirante.cvUrl}`;
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn('Error eliminando archivo:', e.message);
      }
    }

    await this.repo.remove(aspirante);
    return { message: 'Aspirante eliminado' };
  }
}
