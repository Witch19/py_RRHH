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
  @IsNotEmpty()
  nombre: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  mensaje?: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  tipoTrabajoId: number;
}
