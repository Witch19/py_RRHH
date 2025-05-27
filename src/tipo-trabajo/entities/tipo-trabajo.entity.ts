import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Trabajador } from '../../trabajador/entities/trabajador.entity';

@Entity()
export class TipoTrabajo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string;

  @OneToMany(() => Trabajador, trabajador => trabajador.tipoTrabajo)
  trabajadores: Trabajador[];
}
