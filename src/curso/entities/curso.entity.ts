import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CursosTrabajadore } from '../../cursos-trabajadores/entities/cursos-trabajador.entity';

@Entity()
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @OneToMany(() => CursosTrabajadore, ct => ct.curso)
  cursosTrabajadores: CursosTrabajadore[];
}
