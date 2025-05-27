import { Test, TestingModule } from '@nestjs/testing';
import { CursosTrabajadoresService } from './cursos-trabajadores.service';

describe('CursosTrabajadoresService', () => {
  let service: CursosTrabajadoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CursosTrabajadoresService],
    }).compile();

    service = module.get<CursosTrabajadoresService>(CursosTrabajadoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
