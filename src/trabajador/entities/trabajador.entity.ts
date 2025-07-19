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
  role: string; // 'ADMIN' o 'TRABAJADOR'

  @Column({ nullable: true })
  telefono?: string;

  @Column({ nullable: true })
  direccion?: string;

  @Column({ nullable: true })
  cvUrl?: string;

  // ✅ área textual, se copia desde tipoTrabajo.nombre
  @Column()
  tipo: string;

  // ✅ ENUM que representa tipo/cargo del trabajador
  @Column({
    type: 'enum',
    enum: tipoTrabajador,
    default: tipoTrabajador.OPERARIO,
  })
  tipoTrabajador: tipoTrabajador;

  // ✅ Relación con tabla TipoTrabajo
  @ManyToOne(() => TipoTrabajo, tipo => tipo.trabajadores, {
    eager: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'tipoTrabajoId' })
  tipoTrabajo: TipoTrabajo;

  @ManyToMany(() => Curso, (curso) => curso.trabajadores)
  cursos: Curso[];
}
