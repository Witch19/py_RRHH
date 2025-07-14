import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class RegisterDto {

@IsString()
  username: string;
  
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  role: string; // Puedes ponerlo opcional si quieres con @IsOptional()

  // ✅ Nuevos campos para crear el trabajador si no existe
  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsNumber()
  tipoTrabajoId?: number;

}
