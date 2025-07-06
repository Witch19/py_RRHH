import { IsBoolean, IsDateString, IsInt } from 'class-validator';

export class CreateCursosTrabajadoresDto {
  @IsInt()
  trabajadorId: number;

  @IsInt()
  cursoId: number;

  @IsDateString()
  fechaRealizacion: string;

  @IsBoolean()
  aprobado: boolean;
}
