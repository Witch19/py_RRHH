import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TipoTrabajo } from 'src/tipo-trabajo/entities/tipo-trabajo.entity.js';// Asegúrate de que la ruta sea correcta

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

  @Column()
  password: string;

  @Column({ nullable: true })
  role: string;

  @ManyToOne(() => TipoTrabajo, (tipoTrabajo) => tipoTrabajo.trabajadores)
  @JoinColumn({ name: 'tipoTrabajoId' })
  tipoTrabajo: TipoTrabajo;

  @Column({ nullable: true })
  tipoTrabajoId: number;
}
