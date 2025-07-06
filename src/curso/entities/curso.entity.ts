import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CursosTrabajadores } from '../../cursos-trabajadores/entities/cursos-trabajadores.entity';

@Entity()
export class Curso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @OneToMany(() => CursosTrabajadores, ct => ct.curso)
  cursosTrabajadores: CursosTrabajadores[];
}
