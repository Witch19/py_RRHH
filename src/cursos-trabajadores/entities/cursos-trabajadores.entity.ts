import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Trabajador } from 'src/trabajador/entities/trabajador.entity';
import { Curso } from 'src/curso/entities/curso.entity';

@Entity('cursos_trabajadores') // Nombre explícito de tabla si deseas
export class CursosTrabajadores {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trabajador, trabajador => trabajador.cursos, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trabajadorId' })
  trabajador: Trabajador;

  @ManyToOne(() => Curso, curso => curso.cursosTrabajadores, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cursoId' })
  curso: Curso;

  @Column({ type: 'date' })
  fechaRealizacion: string;

  @Column({ type: 'boolean', default: false })
  aprobado: boolean;
}