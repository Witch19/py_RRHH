import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { CursosTrabajadoresService } from './cursos-trabajadores.service';
import { CreateCursosTrabajadoresDto } from './dto/create-cursos-trabajadores.dto';
import { UpdateCursosTrabajadoresDto } from './dto/update-cursos-trabajadores.dto';

@Controller('cursos-trabajadores')
export class CursosTrabajadoresController {
  constructor(private readonly service: CursosTrabajadoresService) {}

  @Post()
  create(@Body() dto: CreateCursosTrabajadoresDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCursosTrabajadoresDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
