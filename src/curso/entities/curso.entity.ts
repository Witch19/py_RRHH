// src/curso/entities/curso.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Trabajador } from '../../trabajador/entities/trabajador.entity';

@Entity()
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  descripcion: string;

  @Column({ nullable: true })
  duracion: string;

  @Column('text', { array: true, default: [] })
  areas: string[];

  @ManyToMany(() => Trabajador, (trab) => trab.cursos, { eager: false })
  @JoinTable()
  trabajadores: Trabajador[];
  cursosTrabajadores: any;
}
