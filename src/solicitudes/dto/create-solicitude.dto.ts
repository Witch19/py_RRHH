import { IsNotEmpty, IsDateString, IsEnum } from 'class-validator';
import { EstadoSolicitud } from '../entities/solicitude.entity';

export class CreateSolicitudDto {
  @IsNotEmpty()
  tipo: string;

  @IsNotEmpty()
  descripcion: string;

  @IsDateString()
  fechaInicio: string;

  @IsDateString()
  fechaFin: string;

  @IsEnum(EstadoSolicitud)
  estado?: EstadoSolicitud; // opcional, por defecto pendiente
}