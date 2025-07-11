import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class CreateTrabajadorDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;  // Debe existir para el hash

  @IsOptional()
  @IsString()
  role?: string;  // Opcional, puede venir o no

  @IsOptional()
  @IsNumber()
  tipoTrabajoId?: number;
}
