import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoTrabajoService } from './tipo-trabajo.service';
import { CreateTipoTrabajoDto } from './dto/create-tipo-trabajo.dto';
import { UpdateTipoTrabajoDto } from './dto/update-tipo-trabajo.dto';

@Controller('tipo-trabajo')
export class TipoTrabajoController {
  constructor(private readonly tipoTrabajoService: TipoTrabajoService) {}

  @Post()
  create(@Body() createTipoTrabajoDto: CreateTipoTrabajoDto) {
    return this.tipoTrabajoService.create(createTipoTrabajoDto);
  }

  @Get()
  findAll() {
    return this.tipoTrabajoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoTrabajoService.findOne(+id);
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
