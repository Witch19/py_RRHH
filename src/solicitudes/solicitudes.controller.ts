import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { Role } from '../enums/role.enum'; // Enum con los roles que definiste

@Controller('solicitudes')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege todas las rutas por JWT + roles
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  @Roles(Role.User, Role.Admin) // Cualquier usuario autenticado puede crear
  create(@Body() createSolicitudDto: CreateSolicitudDto, @Request() req) {
    return this.solicitudesService.create(createSolicitudDto, req.user);
  }

  @Get()
  @Roles(Role.Admin) // Solo admin puede ver todas las solicitudes
  findAll() {
    return this.solicitudesService.findAll();
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin)
  findOne(@Param('id') id: string) {
    return this.solicitudesService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.User, Role.Admin)
  update(@Param('id') id: string, @Body() updateData: Partial<CreateSolicitudDto>) {
    return this.solicitudesService.update(id, updateData);
  }

  @Delete(':id')
  @Roles(Role.Admin) // Solo admin puede eliminar
  remove(@Param('id') id: string) {
    return this.solicitudesService.remove(id);
  }
}
