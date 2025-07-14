// src/data-source.ts
import { DataSource } from 'typeorm';
import { Trabajador } from './trabajador/entities/trabajador.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'tu_usuario',
  password: 'tu_clave',
  database: 'nombre_basedatos',
  entities: [Trabajador],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
