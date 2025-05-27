import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './entities/solicitude.entity';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepo: Repository<Solicitud>,
  ) {}

  create(createSolicitudDto: CreateSolicitudDto) {
    const solicitud = this.solicitudRepo.create(createSolicitudDto);
    return this.solicitudRepo.save(solicitud);
  }

  findAll() {
    return this.solicitudRepo.find({ relations: ['trabajador'] });
  }

  findOne(id: number) {
    return this.solicitudRepo.findOne(id, { relations: ['trabajador'] });
  }

  async update(id: number, updateData: Partial<CreateSolicitudDto>) {
    await this.solicitudRepo.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.solicitudRepo.delete(id);
  }
}