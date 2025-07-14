// src/trabajador/entities/trabajador.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Solicitud } from '../../solicitudes/entities/solicitude.entity';
import { TipoTrabajo } from '../../tipo-trabajo/entities/tipo-trabajo.entity';
import { Curso } from '../../curso/entities/curso.entity';

@Entity()
export class Trabajador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string; // 'ADMIN' o 'TRABAJADOR'

  @Column({ nullable: true })
  telefono?: string;

  @Column({ nullable: true })
  direccion?: string;

  @Column({ nullable: true })
  cvUrl?: string;

  @Column({ nullable: true })
  area?: string;

  @ManyToOne(() => TipoTrabajo, { eager: true, nullable: true })
  @JoinColumn()
  tipoTrabajo?: TipoTrabajo;

  @ManyToMany(() => Curso, (curso) => curso.trabajadores)
  cursos: Curso[];


  @OneToMany(() => Solicitud, (solicitud) => solicitud.trabajador)
  solicitudes: Solicitud[];

}
