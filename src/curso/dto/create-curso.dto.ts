import { IsString } from 'class-validator';

export class CreateCursoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;
}
