// src/aspirante/entities/aspirante.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { tipoTrabajador } from 'src/enums/tipoTrabajador.enum';

@Entity()
export class Aspirante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: tipoTrabajador })
  tipoTrabajo: tipoTrabajador;

  @Column({ nullable: true })
  mensaje?: string;

  @Column({ nullable: true })
  cvUrl?: string;
}
