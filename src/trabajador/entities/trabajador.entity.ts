import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TipoTrabajo } from '../../tipo-trabajo/entities/tipo-trabajo.entity';
import { CursosTrabajadore } from 'src/cursos-trabajadores/entities/cursos-trabajador.entity';


@Entity()
export class Trabajador {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  apellido: string;

  @Column()
  correo: string;

  @OneToMany(() => CursosTrabajadore, ct => ct.trabajador)
  cursos: CursosTrabajadore[];


  @ManyToOne(() => TipoTrabajo, tipo => tipo.trabajadores)
  @JoinColumn({ name: 'tipo_trabajo_id' })
  tipoTrabajo: TipoTrabajo;
    solicitudes: any;
}
