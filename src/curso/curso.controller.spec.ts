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
import { CursoService } from './curso.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('curso')
export class CursoController {
  constructor(private readonly service: CursoService) { }

  @Post()
  @Roles('ADMIN') // Solo el ADMIN puede crear cursos
  create(@Body() dto: CreateCursoDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('ADMIN', 'TRABAJADOR') // Ambos roles pueden ver
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'TRABAJADOR') // Ambos roles pueden ver detalles
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Patch(':id')
@Roles('ADMIN')
update(@Param('id') id: string, @Body() dto: UpdateCursoDto) {
  console.log('📌 PATCH /curso/:id =>', id, dto);
  return this.service.update(+id, dto);
}

@Delete(':id')
@Roles('ADMIN')
remove(@Param('id') id: string) {
  console.log('🗑️ DELETE /curso/:id =>', id);
  return this.service.remove(+id);
}


}
