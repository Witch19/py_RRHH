import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitudDto } from './create-solicitude.dto';

export class UpdateSolicitudeDto extends PartialType(CreateSolicitudDto) {}
