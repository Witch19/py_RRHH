import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

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
}
