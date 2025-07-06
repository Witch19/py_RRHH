import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { TipoTrabajo } from '../../tipo-trabajo/entities/tipo-trabajo.entity';
import { CursosTrabajadores } from '../../cursos-trabajadores/entities/cursos-trabajadores.entity';
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

  @OneToMany(() => CursosTrabajadores, cursosTrabajadore => cursosTrabajadore.trabajador)
  cursos: CursosTrabajadores[];

  @OneToMany(() => Solicitud, solicitud => solicitud.trabajador)
  solicitudes: Solicitud[];
}
