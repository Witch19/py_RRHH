import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TipoTrabajo } from '../../tipo-trabajo/entities/tipo-trabajo.entity';


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

  @ManyToOne(() => TipoTrabajo, tipo => tipo.trabajadores)
  @JoinColumn({ name: 'tipo_trabajo_id' })
  tipoTrabajo: TipoTrabajo;
    solicitudes: any;
}
