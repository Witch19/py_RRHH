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
import { Repository } from 'typeorm';
import { DeepPartial } from 'typeorm';

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

  /* ----------------------------------------------------------------
   * 1. REGISTRO
  ---------------------------------------------------------------- */
  async register(dto: RegisterDto) {
    try {
      const existing = await this.userModel.findOne({ email: dto.email });
      if (existing) {
        throw new ConflictException('Este correo ya está registrado');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // Buscar si ya existe un trabajador con ese email
      let trabajador = await this.trabajadorRepo.findOne({
        where: { email: dto.email },
      });

      if (!trabajador) {
        // Buscar tipoTrabajo si viene
        let tipoTrabajo: TipoTrabajo | null = null;

        if (dto.tipoTrabajoId !== undefined && dto.tipoTrabajoId !== null) {
          const id = Number(dto.tipoTrabajoId);
          if (isNaN(id) || id <= 0) {
            throw new BadRequestException('tipoTrabajoId inválido');
          }

          tipoTrabajo = await this.tipoTrabajoRepo.findOne({
            where: { id },
          });

          if (!tipoTrabajo) {
            throw new NotFoundException(
              `Tipo de trabajo con ID ${id} no encontrado`,
            );
          }
        }

        // Crear trabajador (usando la misma variable trabajador)
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

      // Crear usuario en MongoDB
      const createdUser = new this.userModel({
        username: dto.username,
        email: dto.email,
        password: hashedPassword,
        role: dto.role?.toUpperCase() || 'TRABAJADOR',
        trabajadorId: trabajador.id,
      });

      await createdUser.save();

      return {
        message: 'Usuario registrado con éxito',
        user: {
          id: createdUser._id,
          username: createdUser.username,
          email: createdUser.email,
          role: createdUser.role,
          trabajadorId: createdUser.trabajadorId,
        },
      };
    } catch (error) {
      console.error('❌ Error en register:', error?.message || error);
      throw new InternalServerErrorException('Error al registrar usuario');
    }
  }


  /* ----------------------------------------------------------------
   * 2. VALIDACIÓN DE CREDENCIALES
  ---------------------------------------------------------------- */
  async validateUser(email: string, password: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;

    const passwordValid = await bcrypt.compare(password, user.password);
    return passwordValid ? user : null;
  }

  /* ----------------------------------------------------------------
   * 3. GENERAR JWT
  ---------------------------------------------------------------- */
  generateJwt(user: UserDocument) {
    const payload = {
      sub: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
      trabajadorId: user.trabajadorId,
    };

    return this.jwtService.sign(payload);
  }

  /* ----------------------------------------------------------------
   * 4. ASEGURAR trabajadorId (login / flujos antiguos)
  ---------------------------------------------------------------- */
  async asegurarTrabajadorId(user: UserDocument): Promise<UserDocument> {
    if (user.trabajadorId) return user;

    const trabajador = await this.trabajadorRepo.findOne({
      where: { email: user.email },
    });

    const trabajadorId = trabajador?.id ?? null;

    if (trabajadorId) {
      await this.userModel.findByIdAndUpdate(user._id, { trabajadorId });
      user.trabajadorId = trabajadorId;
    }

    return user;
  }

  /* ----------------------------------------------------------------
   * 5. LOGIN
  ---------------------------------------------------------------- */
  async login(email: string, password: string) {
    let user = await this.validateUser(email, password);
    if (!user) throw new NotFoundException('Credenciales inválidas');

    user = await this.asegurarTrabajadorId(user);

    const token = this.generateJwt(user);

    const { password: _pwd, ...userSafe } = user.toObject();
    return {
      access_token: token,
      user: { ...userSafe, id: userSafe._id },
    };
  }

  /* ----------------------------------------------------------------
   * 6. PERFIL DEL USUARIO
  ---------------------------------------------------------------- */
  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  /* ----------------------------------------------------------------
   * 7. Obtener trabajador por email (utilidad)
  ---------------------------------------------------------------- */
  async getTrabajadorPorEmail(email: string) {
    return this.trabajadorRepo.findOne({ where: { email } });
  }

  /* ----------------------------------------------------------------
 * 8. UPDATE PROFILE
---------------------------------------------------------------- */
  async updateProfile(userId: string, dto: UpdateUserDto) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Validar si el nuevo correo ya existe
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.userModel.findOne({ email: dto.email });
      if (emailExists) {
        throw new ConflictException('Este correo ya está en uso');
      }
    }

    // Solo actualiza campos permitidos
    if (dto.username) user.username = dto.username;
    if (dto.email) user.email = dto.email;

    // 🚫 No se toca el rol
    await user.save();

    // Retorna el usuario sin contraseña
    const { password, ...safeUser } = user.toObject();
    return safeUser;
  }

}
