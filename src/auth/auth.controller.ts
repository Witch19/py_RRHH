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
  constructor(private readonly authService: AuthService) { }

  // 🟢 REGISTRO
  @Public()
  @Post('/register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // 🟢 LOGIN
  @Public()
  @Post('/login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    if (!email || !password) {
      throw new UnauthorizedException('Email y contraseña son obligatorios');
    }

    let user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    user = await this.authService.asegurarTrabajadorId(user);
    const token = await this.authService.generateJwt(user);
    const userData = typeof user.toObject === 'function' ? user.toObject() : user;
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
