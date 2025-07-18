// src/trabajador/dto/create-trabajador.dto.ts
import { IsOptional, IsString, IsEmail, IsEnum, IsNumber } from 'class-validator';
import { tipoTrabajador } from 'src/enums/tipoTrabajador.enum';

export class CreateTrabajadorDto {
  @IsString()
  nombre: string;

  @IsString()
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

  // Relación con TipoTrabajo
  @IsOptional()
  @IsNumber()
  tipoTrabajoId?: number;

  // Enum tipoTrabajador
  @IsOptional()
  @IsEnum(tipoTrabajador)
  tipoTrabajador?: tipoTrabajador;
}
