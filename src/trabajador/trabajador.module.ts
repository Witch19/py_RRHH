import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trabajador } from './entities/trabajador.entity';
import { TrabajadorService } from './trabajador.service';
import { TrabajadorController } from './trabajador.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trabajador])],
  providers: [TrabajadorService],
  controllers: [TrabajadorController],
})
export class TrabajadorModule {}
