import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument } from './schemas/user.schema'; // ajusta la ruta según tu proyecto

/* ---------- Payload que esperas en el token ---------- */
export interface JwtPayload {
  sub: string;     // _id del usuario
  email: string;   // (u otros claims que incluyas)
}

/* ---------- Estrategia JWT ---------- */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /* Este método se llama cada vez que un guardia 'jwt' valida el token */
  async validate(payload: JwtPayload) {
    const user = await this.userModel
      .findById(payload.sub)
      .select('-password')
      .lean(); // devuelve un objeto plano

    if (!user) {
      throw new UnauthorizedException('Token inválido o usuario no encontrado');
    }

    /* Lo que devuelvas aquí se inyecta en req.user */
    return { ...user, sub: payload.sub };
  }
}
