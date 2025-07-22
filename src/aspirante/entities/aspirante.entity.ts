import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TipoTrabajo } from '../../tipo-trabajo/entities/tipo-trabajo.entity';

@Entity()
export class Aspirante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  mensaje: string;

  @Column({ nullable: true })
  cvUrl: string;

  @ManyToOne(() => TipoTrabajo, { eager: true })
  @JoinColumn({ name: 'tipoTrabajoId' }) // opcional para claridad
  tipoTrabajo: TipoTrabajo;
}
