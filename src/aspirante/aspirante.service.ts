import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aspirante } from './entities/aspirante.entity';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';
import { v2 as cloudinary } from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    let cvUrl: string | undefined = undefined;

    if (filename) {
      const localPath = path.join(__dirname, '..', '..', 'uploads', 'cv', filename);

      try {
        const uploadResult = await cloudinary.uploader.upload(localPath, {
          resource_type: 'raw',
          folder: 'rrhh-cv',
          public_id: filename.split('.')[0],
        });

        cvUrl = uploadResult.secure_url;

        // Borra el archivo local después de subirlo a Cloudinary
        fs.unlinkSync(localPath);
      } catch (error) {
        console.error('Error subiendo a Cloudinary:', error);
      }
    }

    const aspirante = this.repo.create({
      nombre: data.nombre,
      email: data.email,
      mensaje: data.mensaje,
      tipoTrabajo,
      cvUrl,
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

    await this.repo.remove(aspirante);
    return { message: 'Aspirante eliminado' };
  }
}
