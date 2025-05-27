import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SolicitudesService } from './solicitudes.service';
import { SolicitudesController } from './solicitudes.controller';
import { Solicitud } from './entities/solicitude.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud])],
  providers: [SolicitudesService],
  controllers: [SolicitudesController],
})
export class SolicitudesModule {}