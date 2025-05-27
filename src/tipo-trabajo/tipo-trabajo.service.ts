import { Injectable } from '@nestjs/common';
import { CreateTipoTrabajoDto } from './dto/create-tipo-trabajo.dto';
import { UpdateTipoTrabajoDto } from './dto/update-tipo-trabajo.dto';

@Injectable()
export class TipoTrabajoService {
  create(createTipoTrabajoDto: CreateTipoTrabajoDto) {
    return 'This action adds a new tipoTrabajo';
  }

  findAll() {
    return `This action returns all tipoTrabajo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoTrabajo`;
  }

  update(id: number, updateTipoTrabajoDto: UpdateTipoTrabajoDto) {
    return `This action updates a #${id} tipoTrabajo`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoTrabajo`;
  }
}
