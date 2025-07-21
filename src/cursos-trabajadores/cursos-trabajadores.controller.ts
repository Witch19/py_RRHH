// src/cursos-trabajadores/cursos-trabajadores.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  NotFoundException,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { CursosTrabajadoresService } from './cursos-trabajadores.service';
import { CreateCursosTrabajadoresDto } from './dto/create-cursos-trabajadores.dto';
import { UpdateCursosTrabajadoresDto } from './dto/update-cursos-trabajadores.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { InscribirDto } from './dto/inscripcion.dto';

@Controller('cursos-trabajadores')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CursosTrabajadoresController {
  constructor(private readonly service: CursosTrabajadoresService) {}

  @Post()
  @Roles('ADMIN', 'SUPERVISOR')
  create(@Body() dto: CreateCursosTrabajadoresDto) {
    return this.service.create(dto);
  }

  @Post('inscribir')
  inscribir(@Body() dto: InscribirDto) {
    return this.service.inscribir(dto);
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
  @Roles('ADMIN', 'TRABAJADOR')
  async remove(@Param('id') id: number, @Req() req: any) {
    const userId = req.user.id;
    const inscripcion = await this.service.findById(id);

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    if (req.user.role !== 'admin' && inscripcion.trabajador.id !== userId) {
      throw new ForbiddenException('No tienes permiso para retirar esta inscripción');
    }

    return this.service.remove(id);
  }
}
