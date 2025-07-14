// src/solicitudes/solicitudes.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';

import { Solicitud, SolicitudSchema } from './schemas/solicitudes.shema';
import { Trabajador } from '../trabajador/entities/trabajador.entity';

@Module({
  imports: [
    // 👇 Importa el esquema de MongoDB
    MongooseModule.forFeature([
      { name: Solicitud.name, schema: SolicitudSchema },
    ]),
    // 👇 Importa el repositorio de PostgreSQL
    TypeOrmModule.forFeature([Trabajador]),
  ],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}
