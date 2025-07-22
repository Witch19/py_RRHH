import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAspiranteDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  nombre: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsOptional()
  @IsString()
  mensaje?: string;

  @IsNotEmpty({ message: 'El tipo de trabajo es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El tipo de trabajo debe ser un número' })
  tipoTrabajoId: number;
}
