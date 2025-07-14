// src/solicitudes/solicitudes.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Solicitud,
  SolicitudDocument,
} from './schemas/solicitudes.shema';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { SolicitudEstado } from './constants/solicitudes-estado.enum';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectModel(Solicitud.name)
    private readonly solicitudModel: Model<SolicitudDocument>,
  ) {}

  /** Crear solicitud nueva (estado inicia como PENDIENTE) */
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
    return {
      ...saved.toObject(),
      id: saved._id,
    };
  }

  /** Obtener todas las solicitudes (solo ADMIN) */
  async findAll() {
    const docs = await this.solicitudModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc) => ({
      ...doc,
      id: doc._id,
    }));
  }

  /** Obtener solicitudes del usuario autenticado */
  async findByUser(userId: number) {
    const docs = await this.solicitudModel.find({ trabajadorId: userId }).sort({ createdAt: -1 }).lean();
    return docs.map((doc) => ({
      ...doc,
      id: doc._id,
    }));
  }

  /** Cambiar el estado de una solicitud */
  async updateEstado(id: string, dto: UpdateEstadoDto) {
    if (!Object.values(SolicitudEstado).includes(dto.estado)) {
      throw new BadRequestException(`Estado inválido: ${dto.estado}`);
    }

    const updated = await this.solicitudModel.findByIdAndUpdate(
      id,
      { estado: dto.estado },
      { new: true },
    ).lean();

    if (!updated) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    return {
      ...updated,
      id: updated._id,
    };
  }

  /** Eliminar solicitud */
  async remove(id: string) {
    const result = await this.solicitudModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    return { message: 'Solicitud eliminada correctamente' };
  }
}
