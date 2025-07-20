// src/aspirante/entities/aspirante.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
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
  tipoTrabajo: TipoTrabajo;
}
