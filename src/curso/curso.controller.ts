// src/curso/curso.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('curso')
export class CursoController {
  constructor(private readonly service: CursoService) {}

  @Roles('admin')
  @Post()
  create(@Body() dto: CreateCursoDto) {
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

  @Roles('admin')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCursoDto) {
    return this.service.update(+id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }

  @Roles('trabajador', 'admin')
  @Post(':id/inscribir')
  inscribir(@Param('id') id: string, @Req() req) {
    return this.service.inscribir(+id, req.user.sub);
  }
}
