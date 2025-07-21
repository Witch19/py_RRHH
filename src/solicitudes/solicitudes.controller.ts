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
import { Request } from 'express';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';

interface UserRequest extends Request {
  user: {
    userId: string;
    trabajadorId: number;
    email: string;
    role: string;
  };
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly service: SolicitudesService) {}

  /** Crear nueva solicitud (TRABAJADOR o ADMIN) */
  @Post()
  @Roles('TRABAJADOR', 'ADMIN')
  async create(@Body() dto: CreateSolicitudDto, @Req() req: UserRequest) {
    return this.service.create(dto, req.user);
  }

  /** Obtener solicitudes: ADMIN → todas, otros → las suyas */
  @Get()
  async find(@Req() req: UserRequest) {
    const { role, trabajadorId } = req.user;
    return role === 'ADMIN'
      ? this.service.findAll()
      : this.service.findByUser(trabajadorId);
  }

  /** Opcional: solo las propias */
  @Get('mias')
  async findMine(@Req() req: UserRequest) {
    return this.service.findByUser(req.user.trabajadorId);
  }

  /** Cambiar estado (solo ADMIN) */
  @Put(':id')
  @Roles('ADMIN')
  updateEstado(@Param('id') id: string, @Body() dto: UpdateEstadoDto) {
    return this.service.updateEstado(id, dto);
  }

  /** Eliminar o cancelar solicitud */
  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: UserRequest) {
    const { role, trabajadorId } = req.user;
    return role === 'ADMIN'
      ? this.service.remove(id)
      : this.service.removeIfOwner(id, trabajadorId);
  }
}
