import { Module } from '@nestjs/common';
import { AspiranteService } from './aspirante.service';
import { AspiranteController } from './aspirante.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aspirante } from './entities/aspirante.entity';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity'; // ✅ importar entidad

@Module({
  imports: [TypeOrmModule.forFeature([Aspirante, TipoTrabajo])], // ✅ agregar aquí también
  controllers: [AspiranteController],
  providers: [AspiranteService],
})
export class AspiranteModule {}
