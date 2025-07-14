import { IsOptional, IsString, IsEmail } from 'class-validator';

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

  @IsOptional()
  tipoTrabajoId?: number;
}
