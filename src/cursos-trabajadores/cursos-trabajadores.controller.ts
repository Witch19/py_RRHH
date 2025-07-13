import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CursosTrabajadoresService } from './cursos-trabajadores.service';
import { CreateCursosTrabajadoresDto } from './dto/create-cursos-trabajadores.dto';
import { UpdateCursosTrabajadoresDto } from './dto/update-cursos-trabajadores.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('cursos-trabajadores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CursosTrabajadoresController {
  constructor(private readonly service: CursosTrabajadoresService) {}

  @Post()
  @Roles('ADMIN', 'SUPERVISOR')
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
  @Roles('ADMIN', 'SUPERVISOR')
  update(@Param('id') id: string, @Body() dto: UpdateCursosTrabajadoresDto) {
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'supervisor')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
