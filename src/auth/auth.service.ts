import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto'; // Asegúrate de tener este DTO

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  // Registro de usuario
  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('Este correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const createdUser = new this.userModel({
      ...dto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      console.log('❌ Usuario no encontrado');
      return null;
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      console.log('❌ Contraseña incorrecta');
      return null;
    }

    console.log('✅ Usuario autenticado');
    return user;
  }

  // Generar JWT
  generateJwt(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
      role: user.role,  // <-- Incluye el rol en el token
    };
    return this.jwtService.sign(payload);
  }

  // Obtener perfil del usuario por ID
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  // Actualizar perfil (username y/o email)
  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Validar si el nuevo email ya existe
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userModel.findOne({ email: dto.email });
      if (emailExists) {
        throw new ConflictException('Este correo ya está en uso');
      }
    }

    user.username = dto.username ?? user.username;
    user.email = dto.email ?? user.email;

    await user.save();
    return user;
  }
}
