import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';
import { CreateTrabajadorDto } from './create-trabajador.dto';
import { PartialType } from '@nestjs/mapped-types';

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
}
