import { Test, TestingModule } from '@nestjs/testing';
import { TipoTrabajoController } from './tipo-trabajo.controller';
import { TipoTrabajoService } from './tipo-trabajo.service';

describe('TipoTrabajoController', () => {
  let controller: TipoTrabajoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoTrabajoController],
      providers: [TipoTrabajoService],
    }).compile();

    controller = module.get<TipoTrabajoController>(TipoTrabajoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
