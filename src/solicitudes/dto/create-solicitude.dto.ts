// src/solicitudes/dto/create-solicitud.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { SolicitudEstado } from '../constants/solicitudes-estado.enum';

export class CreateSolicitudDto {
  @IsString({ message: 'El tipo de solicitud debe ser un texto' })
  @IsNotEmpty({ message: 'El tipo de solicitud es obligatorio' })
  tipo: string;

  @IsString({ message: 'La descripción debe ser un texto' })
  @IsOptional()
  descripcion?: string;

  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida (ISO)' })
  fechaInicio: string;

  @IsDateString({}, { message: 'La fecha de fin debe ser una fecha válida (ISO)' })
  fechaFin: string;

  @IsOptional()
  @IsEnum(SolicitudEstado, {
    message: `El estado debe ser uno de: ${Object.values(SolicitudEstado).join(', ')}`,
  })
  estado?: SolicitudEstado;
}
