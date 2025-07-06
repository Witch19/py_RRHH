import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursosTrabajadores } from './entities/cursos-trabajadores.entity';
import { CreateCursosTrabajadoresDto } from './dto/create-cursos-trabajadores.dto';
import { UpdateCursosTrabajadoresDto } from './dto/update-cursos-trabajadores.dto';

@Injectable()
export class CursosTrabajadoresService {
  constructor(
    @InjectRepository(CursosTrabajadores)
    private readonly repo: Repository<CursosTrabajadores>
  ) {}

    async create(dto: CreateCursosTrabajadoresDto) {
    try {
      const nuevaRelacion = this.repo.create({
        trabajador: { id: dto.trabajadorId },
        curso: { id: dto.cursoId },
        fechaRealizacion: dto.fechaRealizacion,
        aprobado: dto.aprobado,
      });

      return await this.repo.save(nuevaRelacion);
    } catch (error) {
      console.error('❌ Error al guardar curso-trabajador:', error);
      throw error;
    }
  }


  findAll() {
    return this.repo.find({ relations: ['trabajador', 'curso'] });
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['trabajador', 'curso'] });
  }

  async update(id: number, dto: UpdateCursosTrabajadoresDto) {
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
