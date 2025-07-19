import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Trabajador } from '../../trabajador/entities/trabajador.entity';

@Entity('tipo_trabajo')
export class TipoTrabajo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Trabajador, trabajador => trabajador.tipoTrabajo)
  trabajadores: Trabajador[];
}

