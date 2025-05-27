import { Test, TestingModule } from '@nestjs/testing';
import { TipoTrabajoService } from './tipo-trabajo.service';

describe('TipoTrabajoService', () => {
  let service: TipoTrabajoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TipoTrabajoService],
    }).compile();

    service = module.get<TipoTrabajoService>(TipoTrabajoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
