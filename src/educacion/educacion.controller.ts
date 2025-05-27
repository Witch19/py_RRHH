import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EducacionService } from './educacion.service';
import { CreateEducacionDto } from './dto/create-educacion.dto';
import { UpdateEducacionDto } from './dto/update-educacion.dto';

@Controller('educacion')
export class EducacionController {
  constructor(private readonly educacionService: EducacionService) {}

  @Post()
  create(@Body() createEducacionDto: CreateEducacionDto) {
    return this.educacionService.create(createEducacionDto);
  }

  @Get()
  findAll() {
    return this.educacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.educacionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEducacionDto: UpdateEducacionDto) {
    return this.educacionService.update(+id, updateEducacionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.educacionService.remove(+id);
  }
}
