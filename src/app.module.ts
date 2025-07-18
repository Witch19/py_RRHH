import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { TipoTrabajoModule } from './tipo-trabajo/tipo-trabajo.module';
import { CursosTrabajadoresModule } from './cursos-trabajadores/cursos-trabajadores.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { TrabajadorModule } from './trabajador/trabajador.module';
import { CursoModule } from './curso/curso.module';

@Module({
  imports: [
    /* 📦 Carga variables de entorno de .env */
    ConfigModule.forRoot({ isGlobal: true }),

    /* 🐘 TypeORM – PostgreSQL */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST') || 'localhost',
        port: parseInt(config.get('DB_PORT') || '5432', 10),
        username: config.get('DB_USER') || 'postgres',
        password: config.get('DB_PASS') || 'postgres',
        database: config.get('DB_NAME') || 'rrhh',
        autoLoadEntities: true,
        synchronize: true, // 🛈 en producción cámbialo a false
        ssl: { rejectUnauthorized: false },
      }),
      inject: [ConfigService],
    }),

    /* Mongoose – MongoDB */
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/rrhh',
    ),

    /* Módulos de la aplicación */
    AuthModule,
    TipoTrabajoModule,
    CursosTrabajadoresModule,
    SolicitudesModule,
    TrabajadorModule,
    CursoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
