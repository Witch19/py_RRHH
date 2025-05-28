import { IsBoolean, IsDateString, IsInt } from 'class-validator';

export class CreateCursosTrabajadoreDto {
  @IsInt()
  trabajadorId: number;

  @IsInt()
  cursoId: number;

  @IsDateString()
  fechaRealizacion: string;

  @IsBoolean()
  aprobado: boolean;
}
