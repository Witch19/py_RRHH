import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudesController } from './solicitudes.controller';
import { SolicitudesService } from './solicitudes.service';
import { Solicitud } from './entities/solicitude.entity';
import { Trabajador } from 'src/trabajador/entities/trabajador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud, Trabajador])],
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}
