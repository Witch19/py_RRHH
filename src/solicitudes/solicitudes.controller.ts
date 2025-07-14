// src/solicitudes/solicitudes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) { }

  /** Crear nueva solicitud (usuario autenticado) */
  @Post()
  async create(@Body() dto: CreateSolicitudDto, @Req() req) {
    console.log('🧪 req.user:', req.user); // ← esto es clave
    return this.service.create(dto, req.user);
  }


  /** Ver todas las solicitudes (solo ADMIN) */
  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.service.findAll();
  }

  /** Ver solicitudes propias */
  @Get('mias')
  findMine(@Req() req) {
    return this.service.findByUser(req.user.trabajadorId);
  }

  /** Cambiar estado (solo ADMIN) */
  @Put(':id')
  @Roles('ADMIN')
  updateEstado(
    @Param('id') id: string,
    @Body() dto: UpdateEstadoDto,
  ) {
    return this.service.updateEstado(id, dto);
  }


  /** Eliminar solicitud (solo ADMIN) */
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
