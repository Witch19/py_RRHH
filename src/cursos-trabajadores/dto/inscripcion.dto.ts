// src/cursos-trabajadores/dto/inscribir.dto.ts
import { IsNumber, IsDateString } from 'class-validator';

export class InscribirDto {
  @IsNumber()
  cursoId: number;

  @IsNumber()
  trabajadorId: number;

  @IsDateString()
  fechaRealizacion: string;
}
