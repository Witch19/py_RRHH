import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { Role } from '../enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  @Roles('ADMIN', 'TRABAJADOR')
  create(@Body() dto: CreateSolicitudDto, @Request() req) {
    return this.solicitudesService.create(dto, req.user);
  }

  @Get()
  @Roles('ADMIN', 'TRABAJADOR')
  findAll() {
    return this.solicitudesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'TRABAJADOR')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesService.findOne(id);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<CreateSolicitudDto>,
  ) {
    return this.solicitudesService.update(id, updateData);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.solicitudesService.remove(id);
  }
}
