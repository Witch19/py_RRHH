// src/auth/jwt.strategy.ts
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  trabajadorId?: number;
}

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

    console.log(
      '🛡️ JWT_SECRET usado en estrategia:',
      configService.get<string>('JWT_SECRET'),
    );
  }

  async validate(payload: JwtPayload) {
    // Buscamos al usuario en la base Mongo y quitamos password
    const user = await this.userModel
      .findById(payload.sub)
      .select('-password')
      .lean();

    if (!user) {
      throw new UnauthorizedException(
        'Token inválido o usuario no encontrado',
      );
    }

    /* ----------------------------------------------------------------
     * El objeto retornado quedará como req.user en los Guards y decoradores.
     * Aseguramos que incluya siempre:
     *   • sub  (id de Mongo)
     *   • email, username, role (por si los necesitas en Guards/Roles)
     *   • trabajadorId          (lo tomamos del payload o de la BD)
    ---------------------------------------------------------------- */
    return {
  ...user,
  sub: payload.sub,
  trabajadorId: payload.trabajadorId ?? user.trabajadorId ?? null,
};

  }
}
