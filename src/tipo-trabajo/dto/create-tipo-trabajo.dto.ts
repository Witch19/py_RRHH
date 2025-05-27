import { IsString } from 'class-validator';

export class CreateTipoTrabajoDto {
  @IsString()
  nombre: string;
}
