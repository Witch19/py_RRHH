import {
  Controller,
  Put,
  Body,
  Get,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserDocument } from './schemas/user.schema';
import { Public } from '../public.decorator';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    if (!email || !password) {
      throw new UnauthorizedException('Email y contraseña son obligatorios');
    }

    const user = await this.authService.validateUser(email, password);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const token = this.authService.generateJwt(user as UserDocument);
    const userData = (user as any).toObject?.() ?? user;
    const { password: _, ...userWithoutPassword } = userData;

    return { user: userWithoutPassword, token };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Put('profile')
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
