import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Trabajador } from 'src/trabajador/entities/trabajador.entity';
import { Curso } from 'src/curso/entities/curso.entity'; 

@Entity()
export class CursosTrabajadores {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trabajador, trabajador => trabajador.cursos)
  trabajador: Trabajador;

  @ManyToOne(() => Curso, curso => curso.cursosTrabajadores)
  curso: Curso;

  @Column({ type: 'date' })
  fechaRealizacion: string;

  @Column({ default: false })
  aprobado: boolean;
}
