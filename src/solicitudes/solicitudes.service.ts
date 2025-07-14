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
   * 1. Crear solicitud nueva
  ---------------------------------------------------------------- */
  async create(dto: CreateSolicitudDto, user: any) {
    const solicitud = new this.solicitudModel({
      tipo: dto.tipo,
      descripcion: dto.descripcion,
      fechaInicio: new Date(dto.fechaInicio),
      fechaFin: new Date(dto.fechaFin),
      estado: SolicitudEstado.PENDIENTE,
      trabajadorId: user.trabajadorId,
    });

    const saved = await solicitud.save();
    return this.mapearSolicitud(saved.toObject());
  }

  /* ----------------------------------------------------------------
   * 2. Obtener TODAS las solicitudes  (ADMIN)
  ---------------------------------------------------------------- */
  async findAll() {
    const docs = await this.solicitudModel
      .find()
      .sort({ createdAt: -1 })
      .lean();

    return Promise.all(docs.map((d) => this.mapearSolicitud(d)));
  }

  /* ----------------------------------------------------------------
   * 3. Obtener solicitudes por usuario
  ---------------------------------------------------------------- */
  async findByUser(trabajadorId: number) {
    const docs = await this.solicitudModel
      .find({ trabajadorId })
      .sort({ createdAt: -1 })
      .lean();

    return Promise.all(docs.map((d) => this.mapearSolicitud(d)));
  }

  /* ----------------------------------------------------------------
   * 4. Cambiar estado
  ---------------------------------------------------------------- */
  async updateEstado(id: string, dto: UpdateEstadoDto) {
    if (!isValidObjectId(id))
      throw new BadRequestException('ID de solicitud inválido');

    if (!Object.values(SolicitudEstado).includes(dto.estado))
      throw new BadRequestException(`Estado inválido: ${dto.estado}`);

    const updated = await this.solicitudModel
      .findByIdAndUpdate(id, { estado: dto.estado }, { new: true })
      .lean();

    if (!updated)
      throw new NotFoundException('Solicitud no encontrada');

    return this.mapearSolicitud(updated);
  }

  /* ----------------------------------------------------------------
   * 5. Eliminar solicitud
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
   * ✨ Utilidad: unir solicitud + trabajador
  ---------------------------------------------------------------- */
  private async mapearSolicitud(doc: any) {
    const trabajador = await this.trabajadorRepo.findOne({
      where: { id: doc.trabajadorId },
      relations: ['tipoTrabajo'],
    });

    return {
      ...doc,
      id: doc._id,
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