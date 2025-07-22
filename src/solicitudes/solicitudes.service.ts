// src/solicitudes/solicitudes.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Solicitud,
  SolicitudDocument,
} from './schemas/solicitudes.shema';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { SolicitudEstado } from './constants/solicitudes-estado.enum';

import { Trabajador } from '../trabajador/entities/trabajador.entity';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectModel(Solicitud.name)
    private readonly solicitudModel: Model<SolicitudDocument>,

    @InjectRepository(Trabajador)
    private readonly trabajadorRepo: Repository<Trabajador>,
  ) {}

  /* ----------------------------------------------------------------
   * 1. Crear nueva solicitud
  ---------------------------------------------------------------- */
  async create(dto: CreateSolicitudDto, trabajadorId: number) {
  console.log('Creando solicitud con:', dto, 'para trabajador:', trabajadorId);

  const solicitud = new this.solicitudModel({
    tipo: dto.tipo,
    descripcion: dto.descripcion,
    fechaInicio: dto.fechaInicio ? new Date(dto.fechaInicio) : undefined,
    fechaFin: dto.fechaFin ? new Date(dto.fechaFin) : undefined,
    estado: SolicitudEstado.PENDIENTE,
    trabajadorId: trabajadorId, // aquí podría fallar si viene undefined
  });

  const saved = await solicitud.save(); // aquí puede estar lanzando el 500
  return this.mapearSolicitud(saved.toObject());
}


  /* ----------------------------------------------------------------
   * 2. Obtener TODAS las solicitudes (ADMIN)
  ---------------------------------------------------------------- */
  async findAll() {
    const docs = await this.solicitudModel
      .find()
      .sort({ createdAt: -1 })
      .lean();

    return Promise.all(docs.map((d) => this.mapearSolicitud(d)));
  }

  /* ----------------------------------------------------------------
   * 3. Obtener solicitudes por trabajador
  ---------------------------------------------------------------- */
  async findByUser(trabajadorId: number) {
    const docs = await this.solicitudModel
      .find({ trabajadorId })
      .sort({ createdAt: -1 })
      .lean();

    return Promise.all(docs.map((d) => this.mapearSolicitud(d)));
  }

  /* ----------------------------------------------------------------
   * 4. Cambiar estado (solo ADMIN)
  ---------------------------------------------------------------- */
  async updateEstado(id: string, dto: UpdateEstadoDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('ID de solicitud inválido');

    if (!Object.values(SolicitudEstado).includes(dto.estado as any))
      throw new BadRequestException(`Estado inválido: ${dto.estado}`);

    const updated = await this.solicitudModel
      .findByIdAndUpdate(id, { estado: dto.estado }, { new: true })
      .lean();

    if (!updated)
      throw new NotFoundException('Solicitud no encontrada');

    return this.mapearSolicitud(updated);
  }

  /* ----------------------------------------------------------------
   * 5. Eliminar solicitud (solo ADMIN)
  ---------------------------------------------------------------- */
  async remove(id: string) {
    if (!isValidObjectId(id))
      throw new BadRequestException('ID de solicitud inválido');

    const { deletedCount } = await this.solicitudModel.deleteOne({ _id: id });
    if (!deletedCount)
      throw new NotFoundException('Solicitud no encontrada');

    return { message: 'Solicitud eliminada correctamente' };
  }

  /* ----------------------------------------------------------------
   * 6. Eliminar si es el dueño y está pendiente
  ---------------------------------------------------------------- */
  async removeIfOwner(id: string, trabajadorId: number) {
    if (!isValidObjectId(id))
      throw new BadRequestException('ID de solicitud inválido');

    const solicitud = await this.solicitudModel.findById(id);
    if (!solicitud) throw new NotFoundException('Solicitud no encontrada');

    if (String(solicitud.trabajadorId) !== String(trabajadorId))
      throw new BadRequestException('No puedes cancelar esta solicitud');

    if (solicitud.estado !== SolicitudEstado.PENDIENTE)
      throw new BadRequestException('Solo se puede cancelar una solicitud pendiente');

    await solicitud.deleteOne();
    return { message: 'Solicitud cancelada correctamente' };
  }

  /* ----------------------------------------------------------------
   * Utilidad: unir solicitud + trabajador
  ---------------------------------------------------------------- */
  private async mapearSolicitud(doc: any) {
    const trabajador = await this.trabajadorRepo.findOne({
      where: { id: doc.trabajadorId },
      relations: ['tipoTrabajo'],
    });

    return {
      id: doc._id.toString(),
      tipo: doc.tipo,
      descripcion: doc.descripcion,
      fechaInicio: doc.fechaInicio,
      fechaFin: doc.fechaFin,
      estado: doc.estado,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      trabajador: trabajador
        ? {
            id: trabajador.id,
            nombre: trabajador.nombre,
            apellido: trabajador.apellido,
            email: trabajador.email,
            telefono: trabajador.telefono,
            direccion: trabajador.direccion,
            area: trabajador.tipoTrabajo?.nombre ?? '',
          }
        : null,
    };
  }
}
