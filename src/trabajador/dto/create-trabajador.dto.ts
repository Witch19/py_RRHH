import { IsOptional, IsString, IsEmail, IsEnum, IsNumber, IsNotEmpty } from 'class-validator';
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

  @IsOptional()
  @IsNumber()
  tipoTrabajoId?: number;

  @IsOptional()
  @IsEnum(tipoTrabajador)
  tipoTrabajador?: tipoTrabajador;

  // ✅ Nuevo campo obligatorio, lo asigna el backend desde tipoTrabajo.nombre
  @IsString()
  @IsNotEmpty()
  tipo: string;
}
