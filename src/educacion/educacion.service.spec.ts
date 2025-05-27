import { Test, TestingModule } from '@nestjs/testing';
import { EducacionService } from './educacion.service';

describe('EducacionService', () => {
  let service: EducacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducacionService],
    }).compile();

    service = module.get<EducacionService>(EducacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
