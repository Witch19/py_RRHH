import { IsNumber, IsDateString, IsBoolean } from 'class-validator';

export class CreateCursosTrabajadoresDto {
  @IsNumber()
  trabajadorId: number;

  @IsNumber()
  cursoId: number;

  @IsDateString()
  fechaRealizacion: string;

  @IsBoolean()
  aprobado: boolean;
}
