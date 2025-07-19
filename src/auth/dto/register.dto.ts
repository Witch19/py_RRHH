import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  role: string; // Si quieres que sea opcional puedes agregar @IsOptional()

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @Type(() => Number) // 👈 convierte string a number automáticamente
  @IsNumber()
  tipoTrabajoId?: number;
}
