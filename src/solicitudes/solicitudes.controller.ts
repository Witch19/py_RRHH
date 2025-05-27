import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitude.dto';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(@Body() createSolicitudDto: CreateSolicitudDto) {
    return this.solicitudesService.create(createSolicitudDto);
  }

  @Get()
  findAll() {
    return this.solicitudesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitudesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateSolicitudDto>) {
    return this.solicitudesService.update(+id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitudesService.remove(+id);
  }
}