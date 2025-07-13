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
import { Role } from '../enums/role.enum';

@Controller('solicitudes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SolicitudesController {  // <- Asegúrate que diga 'export'
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  @Roles(Role.User, Role.Admin)
  create(@Body() createSolicitudDto: CreateSolicitudDto, @Request() req) {
    return this.solicitudesService.create(createSolicitudDto, req.user);
  }

  @Get()
  @Roles(Role.Admin)
  findAll() {
    return this.solicitudesService.findAll();
  }

  @Get(':id')
  @Roles(Role.User, Role.Admin)
  findOne(@Param('id') id: string) {
    return this.solicitudesService.findOne(+id);
  }

  @Put(':id')
  @Roles(Role.User, Role.Admin)
  update(@Param('id') id: string, @Body() updateData: Partial<CreateSolicitudDto>) {
    return this.solicitudesService.update(+id, updateData);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.solicitudesService.remove(+id);
  }
}