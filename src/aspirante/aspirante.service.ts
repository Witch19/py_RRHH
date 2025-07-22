import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aspirante } from './entities/aspirante.entity';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { Readable } from 'stream';

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
  ) { }

  async create(data, file: Express.Multer.File) {
    const tipoTrabajo = await this.tipoRepo.findOneBy({
      id: Number(data.tipoTrabajoId),
    });

    if (!tipoTrabajo) {
      throw new NotFoundException('Tipo de trabajo no encontrado');
    }

    // Log para ver datos recibidos
    console.log('📥 Datos recibidos:', {
      nombre: data.nombre,
      email: data.email,
      tipoTrabajoId: data.tipoTrabajoId,
      mensaje: data.mensaje,
    });

    let cvUrl: string | undefined;

    if (file && file.buffer) {
      // Log para verificar archivo recibido
      console.log('📎 Archivo recibido:', {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      // Validar tipo de archivo PDF
      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Solo se permiten archivos PDF');
      }

      try {
        const uploadResult = await this.uploadToCloudinary(file.buffer, file.originalname);
        cvUrl = uploadResult.secure_url;
        console.log('✅ CV subido a Cloudinary:', cvUrl);
      } catch (error) {
        // Log detallado del error en Cloudinary
        console.error('❌ Error al subir a Cloudinary:', error);
        throw new InternalServerErrorException('Error al subir el archivo');
      }
    } else {
      console.warn('⚠️ No se recibió ningún archivo o archivo vacío');
    }

    const aspirante = this.repo.create({
      nombre: data.nombre,
      email: data.email,
      mensaje: data.mensaje,
      tipoTrabajo,
      cvUrl,
    });

    const saved = await this.repo.save(aspirante);
    // Log de confirmación de guardado en BD
    console.log('📝 Aspirante guardado en base de datos:', saved);
    return saved;
  }

  private async uploadToCloudinary(buffer: Buffer, filename: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      console.log('Iniciando upload a Cloudinary, archivo:', filename, 'Tamaño buffer:', buffer.length);
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',  // Cambiado a 'auto'
          folder: 'rrhh-cv',
          public_id: filename.split('.')[0],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            console.error('❌ Cloudinary upload_stream error:', error);
            return reject(error);
          }
          if (!result) {
            console.error('❌ Cloudinary: no result recibido');
            return reject(new Error('No result from Cloudinary'));
          }
          console.log('✅ Upload exitoso:', result.secure_url);
          resolve(result);
        },
      );

      Readable.from(buffer).pipe(stream);
    });
  }


  async findAll() {
    const aspirantes = await this.repo.find({
      relations: ['tipoTrabajo'],
    });

    return aspirantes.map((a) => ({
      ...a,
      area: a.tipoTrabajo?.nombre || 'Sin área',
    }));
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
