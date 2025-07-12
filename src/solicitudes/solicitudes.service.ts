import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Solicitud } from './entities/solicitude.entity';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';

@Injectable()
export class SolicitudesService {
  constructor(
    @InjectModel(Solicitud.name)
    private readonly solicitudModel: Model<Solicitud>,
  ) {}

  /**
   * Crea una nueva solicitud.
   * Si recibes el usuario autenticado desde el controlador,
   * puedes añadirlo como `creadoPor`.
   */
  async create(createSolicitudDto: CreateSolicitudDto, user?: any) {
    const nuevaSolicitud = new this.solicitudModel({
      ...createSolicitudDto,
      creadoPor: user?._id ?? null, // opcional
    });

    return nuevaSolicitud.save();
  }

  /**
   * Devuelve todas las solicitudes, populando la referencia a trabajador.
   */
  async findAll() {
    return this.solicitudModel.find().populate('trabajador').exec();
  }

  /**
   * Devuelve una solicitud por su _id.
   */
  async findOne(id: string) {
    return this.solicitudModel.findById(id).populate('trabajador').exec();
  }

  /**
   * Actualiza una solicitud y devuelve el documento actualizado.
   */
  async update(id: string, updateData: Partial<CreateSolicitudDto>) {
    return this.solicitudModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  /**
   * Elimina una solicitud por su _id.
   */
  async remove(id: string) {
    return this.solicitudModel.findByIdAndDelete(id).exec();
  }
}
