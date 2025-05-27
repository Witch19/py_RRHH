import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Trabajador } from '../../trabajador/entities/trabajador.entity';

export enum EstadoSolicitud {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
}

@Entity()
export class Solicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo: string; // ejemplo: 'vacaciones', 'permiso', etc.

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFin: Date;

  @Column({
    type: 'enum',
    enum: EstadoSolicitud,
    default: EstadoSolicitud.PENDIENTE,
  })
  estado: EstadoSolicitud;

  @ManyToOne(() => Trabajador, trabajador => trabajador.solicitudes)
  trabajador: Trabajador;
}