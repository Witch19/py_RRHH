// src/auth/auth.service.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';

import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Trabajador } from '../trabajador/entities/trabajador.entity';
import { TipoTrabajo } from '../tipo-trabajo/entities/tipo-trabajo.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    @InjectRepository(Trabajador)
    private readonly trabajadorRepo: Repository<Trabajador>,
    @InjectRepository(TipoTrabajo)
    private readonly tipoTrabajoRepo: Repository<TipoTrabajo>,
  ) { }

  /* 1. REGISTRO */
  async register(dto: RegisterDto) {
    try {
      const existing = await this.userModel.findOne({ email: dto.email });
      if (existing) {
        throw new ConflictException('Este correo ya está registrado');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      let trabajador = await this.trabajadorRepo.findOne({
        where: { email: dto.email },
      });

      if (!trabajador) {
        let tipoTrabajo: TipoTrabajo | null = null;

        if (dto.tipoTrabajoId !== undefined && dto.tipoTrabajoId !== null) {
          const id = Number(dto.tipoTrabajoId);
          if (isNaN(id) || id <= 0) {
            throw new BadRequestException('tipoTrabajoId inválido');
          }

          tipoTrabajo = await this.tipoTrabajoRepo.findOne({ where: { id } });

          if (!tipoTrabajo) {
            throw new NotFoundException(`Tipo de trabajo con ID ${id} no encontrado`);
          }
        }

        trabajador = this.trabajadorRepo.create({
          nombre: dto.username,
          apellido: '-',
          email: dto.email,
          telefono: dto.telefono,
          direccion: dto.direccion,
          password: hashedPassword,
          role: dto.role?.toUpperCase() || 'TRABAJADOR',
          tipoTrabajo,
        } as DeepPartial<Trabajador>);

        trabajador = await this.trabajadorRepo.save(trabajador);
      }

      const createdUser = new this.userModel({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        role: dto.role?.toUpperCase() || 'TRABAJADOR',
        trabajadorId: trabajador.id,
        telefono: dto.telefono,
        tipoTrabajoId: dto.tipoTrabajoId,
      });

      await createdUser.save();

      const u = createdUser.toObject() as any;

      return {
        message: 'Usuario registrado con éxito',
        user: {
          id: u._id,
          username: u.username,
          email: u.email,
          role: u.role,
          trabajadorId: u.trabajadorId ?? null,
        },
      };
    } catch (error) {
      console.error('❌ Error en register:', error?.message || error);
      throw new InternalServerErrorException('Error al registrar usuario');
    }
  }

  /* 2. VALIDAR CREDENCIALES */
  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;

    const passwordValid = await bcrypt.compare(password, user.password);
    return passwordValid ? user : null;
  }

  /* 3. GENERAR JWT */
  generateJwt(user: UserDocument) {
    const plainUser = typeof user.toObject === 'function' ? user.toObject() : user;

    const payload = {
      sub: plainUser._id,
      email: plainUser.email,
      username: plainUser.username,
      role: plainUser.role,
      trabajadorId: plainUser.trabajadorId,
    };

    return this.jwtService.sign(payload);
  }

  /* 4. ASEGURAR trabajadorId */
  async asegurarTrabajadorId(user: UserDocument): Promise<UserDocument> {
    if ((user as any).trabajadorId) return user;

    const trabajador = await this.trabajadorRepo.findOne({
      where: { email: user.email },
    });

    if (trabajador?.id) {
      (user as any).trabajadorId = trabajador.id;
      await user.save();
    }

    return user;
  }

  /* 5. LOGIN */
  async login(emailOrUsername: string, password: string) {
    let user = await this.validateUser(emailOrUsername, password);
    if (!user) throw new NotFoundException('Credenciales inválidas');

    user = await this.asegurarTrabajadorId(user);

    const token = this.generateJwt(user);
    const { password: _pwd, ...userSafe } = user.toObject();

    return {
      access_token: token,
      user: { ...userSafe, id: userSafe._id },
    };
  }

  /* 6. PERFIL */
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  /* 7. Obtener trabajador por email */
  async getTrabajadorPorEmail(email: string) {
    return this.trabajadorRepo.findOne({ where: { email } });
  }

  /* 8. UPDATE PERFIL USUARIO */
  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Validar si el nuevo correo ya está en uso por otro usuario
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userModel.findOne({ email: dto.email });
      if (emailExists) {
        throw new ConflictException('Este correo ya está en uso');
      }
    }

    // Aplicar actualizaciones
    if (dto.username) user.username = dto.username;
    if (dto.email) user.email = dto.email;
    if (dto.role) user.role = dto.role;
    if (dto.telefono) user.telefono = dto.telefono;
    if (dto.tipoTrabajoId !== undefined) user.tipoTrabajoId = dto.tipoTrabajoId;

    await user.save();
    const { password, ...safeUser } = user.toObject(); // sin contraseña

    return safeUser; // ✅ Retornamos objeto plano sin password
  }


  /* 9. LISTAR TODOS LOS USUARIOS (ADMIN) */
  async findAll() {
    return this.userModel.find().select('-password');
  }

  /* 10. ACTUALIZAR USUARIO (ADMIN) */
  async updateUserByAdmin(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.username !== undefined) user.username = dto.username;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.telefono !== undefined) user.telefono = dto.telefono;
    if (dto.tipoTrabajoId !== undefined) user.tipoTrabajoId = dto.tipoTrabajoId;

    await user.save();

    return {
      message: 'Usuario actualizado correctamente',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        telefono: user.telefono,
        tipoTrabajoId: user.tipoTrabajoId,
      },
    };
  }

  /* 11. ELIMINAR USUARIO (ADMIN) */
  async removeUser(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Usuario no encontrado');
    return { message: 'Usuario eliminado correctamente' };
  }
}
