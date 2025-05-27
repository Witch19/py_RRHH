import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
/*import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TipoTrabajoService } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';*/
import { TipoTrabajoModule } from './tipo-trabajo/tipo-trabajo.module';
import { CursosTrabajadoresModule } from './cursos-trabajadores/cursos-trabajadores.module';
import { EducacionModule } from './educacion/educacion.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { AuthModule } from './auth/auth.module';

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
      ssl: { rejectUnauthorized: false },
    }),
    AuthModule,
    /*UsersModule,
    CategoriesModule,
    PostsModule,*/
    TipoTrabajoModule,
    CursosTrabajadoresModule,
    EducacionModule,
    SolicitudesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
  