import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoTrabajoService } from './tipo-trabajo.service';
import { CreateTipoTrabajoDto } from './dto/create-tipo-trabajo.dto';
import { UpdateTipoTrabajoDto } from './dto/update-tipo-trabajo.dto';

@Controller('tipo-trabajo')
export class TipoTrabajoController {
  constructor(private readonly tipoTrabajoService: TipoTrabajoService) {}

  @Post()
  create(@Body() dto: CreateTipoTrabajoDto) {
    return this.tipoTrabajoService.create(dto);
  }

  @Get()
  findAll() {
    return this.tipoTrabajoService.findAll();
  }

  // ✅ Endpoint para el frontend (select de áreas)
  @Get('enum')
  findAllEnum() {
    return this.tipoTrabajoService.findAllEnum();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoTrabajoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateTipoTrabajoDto) {
    return this.tipoTrabajoService.update(+id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoTrabajoService.remove(+id);
  }
}
