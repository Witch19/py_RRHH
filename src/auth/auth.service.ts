import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/auser.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(dto: CreateAuthDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const newUser = this.userRepo.create({ ...dto, password: hashedPassword });
    await this.userRepo.save(newUser);
    return { message: 'Usuario registrado correctamente' };
  }

  async login(dto: LoginAuthDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, username: user.username };
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
  }

  async getProfile(id: number) {
    return this.userRepo.findOne({ where: { id } });
  }
}
