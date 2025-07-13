import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './entities/solicitude.entity';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';
import { Trabajador } from '../trabajador/entities/trabajador.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private readonly solicitudRepo: Repository<Solicitud>,
    @InjectRepository(Trabajador)
    private readonly trabajadorRepo: Repository<Trabajador>,
  ) {}

  async create(dto: CreateSolicitudDto, user: any) {
    const trabajador = await this.trabajadorRepo.findOne({
      where: { id: user.trabajadorId }, // ✅ Usa trabajadorId en vez de sub
    });

    if (!trabajador) {
      throw new NotFoundException('Trabajador no encontrado');
    }

    const solicitud = this.solicitudRepo.create({
      ...dto,
      trabajador,
    });

    return this.solicitudRepo.save(solicitud);
  }

  findAll() {
    return this.solicitudRepo.find({ relations: ['trabajador'] });
  }

  findOne(id: number) {
    return this.solicitudRepo.findOne({ where: { id }, relations: ['trabajador'] });
  }

  async update(id: number, updateData: Partial<CreateSolicitudDto>) {
    await this.solicitudRepo.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.solicitudRepo.delete(id);
  }
}