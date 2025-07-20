import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinColumn,
} from 'typeorm';
import { TipoTrabajo } from '../../tipo-trabajo/entities/tipo-trabajo.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { tipoTrabajador } from 'src/enums/tipoTrabajador.enum';

@Entity('trabajador')
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
  password: string; // ✅ faltaba campo para autenticación

  @Column({ default: 'TRABAJADOR' })
  role: string;

  @Column({ nullable: true })
  telefono?: string;

  @Column({ nullable: true })
  direccion?: string;

  @Column({ nullable: true })
  cvUrl?: string;

  @Column({
    type: 'enum',
    enum: tipoTrabajador,
    default: tipoTrabajador.OPERARIO,
  })
  tipoTrabajador: tipoTrabajador;

  @Column({ nullable: true }) // FK para relación con TipoTrabajo
  tipoTrabajoId: number;

  @ManyToOne(() => TipoTrabajo, tipo => tipo.trabajadores, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'tipoTrabajoId' })
  tipoTrabajo: TipoTrabajo;

  @ManyToMany(() => Curso, (curso) => curso.trabajadores)
  cursos: Curso[];
}
