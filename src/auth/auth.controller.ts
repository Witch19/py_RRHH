// src/auth/auth.controller.ts
import {
  Controller,
  Put,
  Body,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../public.decorator';
import { Roles } from '../roles/roles.decorator';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from '../roles/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 🟢 REGISTRO
  @Public()
  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // 🟢 LOGIN actualizado para email o username
  @Public()
  @Post('/login')
  async login(@Body() body: { emailOrUsername: string; password: string }) {
    const { emailOrUsername, password } = body;
    if (!emailOrUsername || !password) {
      throw new UnauthorizedException('Email o username y contraseña son obligatorios');
    }

    const user = await this.authService.validateUser(emailOrUsername, password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const userWithTrabajador = await this.authService.asegurarTrabajadorId(user);
    const token = await this.authService.generateJwt(userWithTrabajador);
    const userData = typeof userWithTrabajador.toObject === 'function'
      ? userWithTrabajador.toObject()
      : userWithTrabajador;

    const { password: _, ...userWithoutPassword } = userData;

    return {
      user: {
        id: userWithoutPassword._id ?? userWithoutPassword.id,
        email: userWithoutPassword.email,
        username: userWithoutPassword.username ?? 'Usuario',
        role: userWithoutPassword.role ?? 'USER',
        trabajadorId: userWithoutPassword.trabajadorId ?? null,
      },
      token,
    };
  }

  // 🟢 PERFIL PROPIO
  @Get('/profile')
  async getProfile(@Req() req) {
    return req.user;
  }

  // 🟢 ACTUALIZAR PERFIL PROPIO
  @Roles('ADMIN', 'TRABAJADOR')
  @Put('/profile')
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    const updated = await this.authService.updateProfile(req.user.sub, dto);

    return {
      message: 'Perfil actualizado',
      user: {
        id: updated._id,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        telefono: updated.telefono ?? null,
        tipoTrabajoId: updated.tipoTrabajoId ?? null,
        trabajadorId: updated.trabajadorId ?? null,
      },
    };
  }

  // 🔐 ADMIN - LISTAR USUARIOS
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.authService.findAll();
  }

  // 🔐 ADMIN - EDITAR USUARIO POR ID
  @Roles('ADMIN')
  @Put(':id')
  async updateById(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.authService.updateUserByAdmin(id, dto);
  }

  // 🔐 ADMIN - ELIMINAR USUARIO POR ID
  @Roles('ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.authService.removeUser(id);
  }
}
