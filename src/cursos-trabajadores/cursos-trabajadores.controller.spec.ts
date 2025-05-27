import { Test, TestingModule } from '@nestjs/testing';
import { CursosTrabajadoresController } from './cursos-trabajadores.controller';
import { CursosTrabajadoresService } from './cursos-trabajadores.service';

describe('CursosTrabajadoresController', () => {
  let controller: CursosTrabajadoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CursosTrabajadoresController],
      providers: [CursosTrabajadoresService],
    }).compile();

    controller = module.get<CursosTrabajadoresController>(CursosTrabajadoresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
