import { PartialType } from '@nestjs/mapped-types';
import { CreateEducacionDto } from './create-educacion.dto';

export class UpdateEducacionDto extends PartialType(CreateEducacionDto) {}
