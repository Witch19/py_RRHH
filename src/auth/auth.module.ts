// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt.guard';
import { RolesGuard } from '../roles/roles.guard';

import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    /* ConfigModule ya suele estar global en AppModule; 
       lo importamos igual para que registerAsync tenga acceso */
    ConfigModule,

    /* Colección User en MongoDB */
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    /* Passport con estrategia por defecto 'jwt' */
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),

    /* JwtModule con la clave y expiración leídas desde .env */
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),           // ← .env
        signOptions: {                                      // ← .env o fallback
          expiresIn: config.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtModule, PassportModule, JwtAuthGuard],
})
export class AuthModule {}
