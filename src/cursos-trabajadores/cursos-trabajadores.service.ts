import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursosTrabajadore } from './entities/cursos-trabajador.entity';
import { CreateCursosTrabajadoreDto } from './dto/create-cursos-trabajadore.dto';
import { UpdateCursosTrabajadoreDto } from './dto/update-cursos-trabajadore.dto';

@Injectable()
export class CursosTrabajadoresService {
  constructor(
    @InjectRepository(CursosTrabajadore)
    private readonly repo: Repository<CursosTrabajadore>
  ) {}

  create(dto: CreateCursosTrabajadoreDto) {
    const nuevaRelacion = this.repo.create({
      trabajador: { id: dto.trabajadorId },
      curso: { id: dto.cursoId },
      fechaRealizacion: dto.fechaRealizacion,
      aprobado: dto.aprobado,
    });

    return this.repo.save(nuevaRelacion);
  }

  findAll() {
    return this.repo.find({ relations: ['trabajador', 'curso'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['trabajador', 'curso'] });
  }

  async update(id: number, dto: UpdateCursosTrabajadoreDto) {
    const registro = await this.repo.findOneBy({ id });
    if (!registro) throw new NotFoundException('Registro no encontrado');

    Object.assign(registro, dto);
    return this.repo.save(registro);
  }

  async remove(id: number) {
    const registro = await this.repo.findOneBy({ id });
    if (!registro) throw new NotFoundException('Registro no encontrado');
    return this.repo.remove(registro);
  }
}
