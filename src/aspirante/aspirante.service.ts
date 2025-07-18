// src/aspirante/aspirante.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aspirante } from './entities/aspirante.entity';

@Injectable()
export class AspiranteService {
  constructor(
    @InjectRepository(Aspirante)
    private readonly repo: Repository<Aspirante>,
  ) {}

  async create(data, filename: string) {
    const aspirante = this.repo.create({
      ...data,
      cvUrl: filename ? `/uploads/cv/${filename}` : undefined,
    });
    return this.repo.save(aspirante);
  }

  findAll() {
    return this.repo.find();
  }
}
