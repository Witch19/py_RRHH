import { Injectable } from '@nestjs/common';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';

@Injectable()
export class TrabajadorService {
  create(createTrabajadorDto: CreateTrabajadorDto) {
    return 'This action adds a new trabajador';
  }

  findAll() {
    return `This action returns all trabajador`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trabajador`;
  }

  update(id: number, updateTrabajadorDto: UpdateTrabajadorDto) {
    return `This action updates a #${id} trabajador`;
  }

  remove(id: number) {
    return `This action removes a #${id} trabajador`;
  }
}
