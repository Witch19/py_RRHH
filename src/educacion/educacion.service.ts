import { Injectable } from '@nestjs/common';
import { CreateEducacionDto } from './dto/create-educacion.dto';
import { UpdateEducacionDto } from './dto/update-educacion.dto';

@Injectable()
export class EducacionService {
  create(createEducacionDto: CreateEducacionDto) {
    return 'This action adds a new educacion';
  }

  findAll() {
    return `This action returns all educacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} educacion`;
  }

  update(id: number, updateEducacionDto: UpdateEducacionDto) {
    return `This action updates a #${id} educacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} educacion`;
  }
}
