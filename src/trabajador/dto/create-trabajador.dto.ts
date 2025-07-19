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

  @IsNumber()
  tipoTrabajoId: number; // ✅ ahora obligatorio, ya que tipo depende de esto

  @IsOptional()
  @IsEnum(tipoTrabajador)
  tipoTrabajador?: tipoTrabajador;
}
