import {
  Controller,
  Put,
  Body,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../public.decorator';
import { Roles } from '../roles/roles.decorator';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard) // Aplica protección global a todos los endpoints (menos los @Public)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  

@Public()
@Post('/login')
async login(@Body() body: { email: string; password: string }) {
  const { email, password } = body;
  if (!email || !password) {
    throw new UnauthorizedException('Email y contraseña son obligatorios');
  }

  let user = await this.authService.validateUser(email, password);
  if (!user) throw new UnauthorizedException('Credenciales inválidas');

  // Asegura que tenga trabajadorId
  user = await this.authService.asegurarTrabajadorId(user);

  const token = this.authService.generateJwt(user);

  // Convertir a objeto plano si es un documento de Mongoose
  const userData = typeof user.toObject === 'function' ? user.toObject() : user;

  const { password: _, ...userWithoutPassword } = userData;

  // Asegura que incluyes los campos necesarios
  const safeUser = {
    id: userWithoutPassword._id ?? userWithoutPassword.id,
    email: userWithoutPassword.email,
    username: userWithoutPassword.username ?? 'Usuario',
    role: userWithoutPassword.role ?? 'USER',
  };

  return { user: safeUser, token };
}

  @Get('/profile') // Ya está protegido globalmente con JwtAuthGuard y RolesGuard
  async getProfile(@Req() req) {
    return req.user;
  }

  @Roles('ADMIN', 'TRABAJADOR')
  @Put('/profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    const updated = await this.authService.updateProfile(req.user.sub, dto);
    return {
      message: 'Perfil actualizado',
      user: {
        _id: updated._id,
        username: updated.username,
        email: updated.email,
      },
    };
  }

}
