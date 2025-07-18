import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoTrabajoService } from './tipo-trabajo.service';
import { CreateTipoTrabajoDto } from './dto/create-tipo-trabajo.dto';
import { UpdateTipoTrabajoDto } from './dto/update-tipo-trabajo.dto';
import { tipoTrabajador } from 'src/enums/tipoTrabajador.enum';

@Controller('tipo-trabajo')
export class TipoTrabajoController {
  constructor(private readonly tipoTrabajoService: TipoTrabajoService) { }

  @Post()
  create(@Body() dto: CreateTipoTrabajoDto) {
    return this.tipoTrabajoService.create(dto);
  }


  @Get()
  findAll() {
    return this.tipoTrabajoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoTrabajoService.findOne(+id);
  }

  @Get('enum')
  getTipoTrabajoEnum() {
    return Object.entries(tipoTrabajador).map(([key, value]) => ({
      key,
      value,
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoTrabajoDto: UpdateTipoTrabajoDto) {
    return this.tipoTrabajoService.update(+id, updateTipoTrabajoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoTrabajoService.remove(+id);
  }
}
