import { IsEmail, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  tipoTrabajoId?: number;
}
