import { Test, TestingModule } from '@nestjs/testing';
import { EducacionController } from './educacion.controller';
import { EducacionService } from './educacion.service';

describe('EducacionController', () => {
  let controller: EducacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducacionController],
      providers: [EducacionService],
    }).compile();

    controller = module.get<EducacionController>(EducacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
