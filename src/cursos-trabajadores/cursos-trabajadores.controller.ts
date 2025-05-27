import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CursosTrabajadoresService } from './cursos-trabajadores.service';
import { CreateCursosTrabajadoreDto } from './dto/create-cursos-trabajadore.dto';
import { UpdateCursosTrabajadoreDto } from './dto/update-cursos-trabajadore.dto';

@Controller('cursos-trabajadores')
export class CursosTrabajadoresController {
  constructor(private readonly cursosTrabajadoresService: CursosTrabajadoresService) {}

  @Post()
  create(@Body() createCursosTrabajadoreDto: CreateCursosTrabajadoreDto) {
    return this.cursosTrabajadoresService.create(createCursosTrabajadoreDto);
  }

  @Get()
  findAll() {
    return this.cursosTrabajadoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cursosTrabajadoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCursosTrabajadoreDto: UpdateCursosTrabajadoreDto) {
    return this.cursosTrabajadoresService.update(+id, updateCursosTrabajadoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cursosTrabajadoresService.remove(+id);
  }
}
