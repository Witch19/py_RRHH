import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateTrabajadorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsEmail()
  correo: string;

  @IsNotEmpty()
  tipoTrabajoId: number;
  email: any;
}
