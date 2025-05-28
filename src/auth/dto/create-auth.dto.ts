import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;
}
