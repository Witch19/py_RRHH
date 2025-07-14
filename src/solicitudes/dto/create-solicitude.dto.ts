// src/solicitudes/dto/create-solicitud.dto.ts
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { SolicitudEstado } from '../constants/solicitudes-estado.enum';

export class CreateSolicitudDto {
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsOptional()
  @IsEnum(SolicitudEstado)
  estado?: SolicitudEstado;
}
