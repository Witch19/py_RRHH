// src/trabajador/entities/trabajador.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { TipoTrabajo } from '../../tipo-trabajo/entities/tipo-trabajo.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { tipoTrabajador } from 'src/enums/tipoTrabajador.enum';

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
  role: string; // 'ADMIN' o 'TRABAJADOR'

  @Column({ nullable: true })
  telefono?: string;

  @Column({ nullable: true })
  direccion?: string;

  @Column({ nullable: true })
  cvUrl?: string;

  @Column({nullable: true })
  area?: string;

  @Column({ type: 'enum', enum: tipoTrabajador })
  tipoTrabajo: tipoTrabajador;

  @ManyToMany(() => Curso, (curso) => curso.trabajadores)
  cursos: Curso[];
}
