import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Solicitud } from './entities/solicitude.entity';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';

@Injectable()
export class SolicitudesService {
  trabajadorRepo: any;
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepo: Repository<Solicitud>,
  ) { }

  async create(createSolicitudDto: CreateSolicitudDto, user: any) {
    const trabajador = await this.trabajadorRepo.findOne({ where: { email: user.email } });
    if (!trabajador) throw new Error('Trabajador no encontrado');

    const solicitud = this.solicitudRepo.create({
      ...createSolicitudDto,
      trabajador,
    });

    return this.solicitudRepo.save(solicitud);
  }


  findAll() {
    return this.solicitudRepo.find({ relations: ['trabajador'] });
  }

  findOne(id: number) {
    return this.solicitudRepo.findOne({
      where: { id },
      relations: ['trabajador'],
    });
  }

  async update(id: number, updateData: Partial<CreateSolicitudDto>) {
    await this.solicitudRepo.update(id, updateData);
    return this.findOne(id);
  }

  remove(id: number) {
    return this.solicitudRepo.delete(id);
  }
}