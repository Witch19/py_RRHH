import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { TipoTrabajo } from '../../tipo-trabajo/entities/tipo-trabajo.entity';
import { CursosTrabajadore } from '../../cursos-trabajadores/entities/cursos-trabajador.entity';
import { Solicitud } from '../../solicitudes/entities/solicitude.entity';

@Entity()
export class Trabajador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  email: string;

  @ManyToOne(() => TipoTrabajo, tipoTrabajo => tipoTrabajo.trabajadores, { eager: true })
  tipoTrabajo?: TipoTrabajo;

  @OneToMany(() => CursosTrabajadore, cursosTrabajadore => cursosTrabajadore.trabajador)
  cursos: CursosTrabajadore[];

  @OneToMany(() => Solicitud, solicitud => solicitud.trabajador)
  solicitudes: Solicitud[];
}
