import { IsOptional, IsString, IsEmail, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { tipoTrabajador } from 'src/enums/tipoTrabajador.enum';

export class CreateTrabajadorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsNotEmpty()
  @Type(() => Number) // ✅ convierte el string a number
  @IsNumber()
  tipoTrabajoId: number;

  @IsOptional()
  @IsEnum(tipoTrabajador)
  tipoTrabajador?: tipoTrabajador;
}
