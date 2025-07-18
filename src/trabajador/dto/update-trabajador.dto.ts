import { IsString, IsEmail, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { CreateTrabajadorDto } from './create-trabajador.dto';
import { PartialType } from '@nestjs/mapped-types';
import { tipoTrabajador } from 'src/enums/tipoTrabajador.enum';

export class UpdateTrabajadorDto extends PartialType(CreateTrabajadorDto) {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsNumber()
  tipoTrabajoId?: number;

  @IsOptional()
  @IsEnum(tipoTrabajador)
  tipoTrabajador?: tipoTrabajador; // ← agregado correctamente
}
