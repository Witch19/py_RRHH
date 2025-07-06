import { PartialType } from '@nestjs/mapped-types';
import { CreateCursosTrabajadoresDto } from './create-cursos-trabajadores.dto';

export class UpdateCursosTrabajadoresDto extends PartialType(CreateCursosTrabajadoresDto) {}
