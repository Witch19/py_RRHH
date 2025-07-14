import { IsEnum } from 'class-validator';
import { SolicitudEstado } from '../constants/solicitudes-estado.enum';

export class UpdateEstadoDto {
  @IsEnum(SolicitudEstado, {
    message: 'Estado inválido. Debe ser PENDIENTE, APROBADO o RECHAZADO',
  })
  estado: SolicitudEstado;
}
