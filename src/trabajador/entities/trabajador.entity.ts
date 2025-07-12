import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { TipoTrabajo } from 'src/tipo-trabajo/entities/tipo-trabajo.entity';
import { CursosTrabajadores } from 'src/cursos-trabajadores/entities/cursos-trabajadores.entity';
import { Solicitud } from 'src/solicitudes/entities/solicitude.entity';


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

  @Column({ default: 'temporal123' })
password: string;


  @Column({ nullable: true })
  role: string;

  @ManyToOne(() => TipoTrabajo, (tipoTrabajo) => tipoTrabajo.trabajadores)
  @JoinColumn({ name: 'tipoTrabajoId' })
  tipoTrabajo: TipoTrabajo;

  @Column({ nullable: true })
  tipoTrabajoId: number;

  // Aquí la relación correcta con CursosTrabajadores
  @OneToMany(() => CursosTrabajadores, (cursoTrabajador) => cursoTrabajador.trabajador)
  cursos: CursosTrabajadores[];

  @OneToMany(() => Solicitud, solicitud => solicitud.trabajador)
  solicitudes: Solicitud[];
}
