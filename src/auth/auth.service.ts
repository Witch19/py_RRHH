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
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trabajador } from '../trabajador/entities/trabajador.entity';

@Injectable()
export class AuthService {
  /*getTrabajadorPorEmail(email: string) {
    throw new Error('Method not implemented.');
  }*/
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    @InjectRepository(Trabajador)
    private readonly trabajadorRepo: Repository<Trabajador>,
  ) {}

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

  async validateUser(email: string, password: string): Promise<UserDocument | null> {
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

  generateJwt(user: any, trabajadorId: number | null) {
  const payload = {
    sub: user._id,
    email: user.email,
    username: user.username,
    role: user.role,
    trabajadorId, // añadido correctamente
  };
  return this.jwtService.sign(payload);
}



  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new NotFoundException('Credenciales inválidas');
    }

    const trabajador = await this.trabajadorRepo.findOne({ where: { email } });
    const trabajadorId = trabajador?.id ?? null;

    const token = this.generateJwt(user, trabajadorId);

    return {
      access_token: token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        trabajadorId,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async getTrabajadorPorEmail(email: string) {
  return this.trabajadorRepo.findOne({ where: { email } });
}



  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

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
