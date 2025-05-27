import { PartialType } from '@nestjs/mapped-types';
import { CreateCursosTrabajadoreDto } from './create-cursos-trabajadore.dto';

export class UpdateCursosTrabajadoreDto extends PartialType(CreateCursosTrabajadoreDto) {}
