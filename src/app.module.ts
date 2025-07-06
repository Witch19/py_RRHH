import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TipoTrabajoModule } from './tipo-trabajo/tipo-trabajo.module';
import { CursosTrabajadoresModule } from './cursos-trabajadores/cursos-trabajadores.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { TrabajadorModule } from './trabajador/trabajador.module';
import { AuthModule } from './auth/auth.module';
import { CursoModule } from './curso/curso.module';
import { TipoTrabajoController } from './tipo-trabajo/tipo-trabajo.controller';
import { TipoTrabajoService } from './tipo-trabajo/tipo-trabajo.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      /*ssl: { 
        rejectUnauthorized: false, 
      } ,*/

    }),
    AuthModule,
    TipoTrabajoModule,
    CursosTrabajadoresModule,
    SolicitudesModule,
    TrabajadorModule,
    CursoModule,
  ],
  controllers: [AppController, TipoTrabajoController],
  providers: [AppService, TipoTrabajoService],
  exports: [TypeOrmModule],
})
export class AppModule {}
  