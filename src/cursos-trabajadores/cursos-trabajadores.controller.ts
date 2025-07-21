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

  // ADMIN o SUPERVISOR pueden crear inscripciones manualmente
  @Post()
  @Roles('ADMIN', 'SUPERVISOR')
  create(@Body() dto: CreateCursosTrabajadoresDto) {
    return this.service.create(dto);
  }

  // Trabajador se inscribe por sí mismo
  @Post('inscribir')
  inscribir(@Body() dto: InscribirDto) {
    return this.service.inscribir(dto);
  }

  // Listar todas las relaciones (ADMIN y trabajador pueden ver)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // Obtener una inscripción específica
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  // ADMIN o SUPERVISOR pueden modificar una relación
  @Patch(':id')
  @Roles('ADMIN', 'SUPERVISOR')
  update(@Param('id') id: string, @Body() dto: UpdateCursosTrabajadoresDto) {
    return this.service.update(+id, dto);
  }

  // ADMIN o el mismo TRABAJADOR pueden eliminar una inscripción
  @Delete(':id')
  @Roles('ADMIN', 'TRABAJADOR')
  async remove(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    const inscripcion = await this.service.findById(+id);

    if (!inscripcion) {
      throw new NotFoundException('Inscripción no encontrada');
    }

    // Solo ADMIN o el mismo trabajador dueño de la inscripción
    if (user.role !== 'ADMIN' && inscripcion.trabajador.id !== user.trabajadorId) {
      throw new ForbiddenException('No tienes permiso para eliminar esta inscripción');
    }

    return this.service.remove(+id);
  }
}
