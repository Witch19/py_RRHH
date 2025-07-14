// src/solicitudes/schemas/solicitud.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SolicitudEstado } from '../constants/solicitudes-estado.enum';

export type SolicitudDocument = Solicitud & Document;

@Schema({ collection: 'solicitudes', timestamps: true })
export class Solicitud {
  @Prop({ required: true })
  tipo: string;

  @Prop({ required: false })
  descripcion?: string;

  @Prop({ type: Date, required: true })
  fechaInicio: Date;

  @Prop({ type: Date, required: true })
  fechaFin: Date;

  @Prop({
    type: String,
    enum: Object.values(SolicitudEstado),
    default: SolicitudEstado.PENDIENTE,
  })
  estado: SolicitudEstado;

  @Prop({ required: true })
  trabajadorId: number; // ← viene desde PostgreSQL
}

export const SolicitudSchema = SchemaFactory.createForClass(Solicitud);
