import { Test, TestingModule } from '@nestjs/testing';
import { AspiranteController } from './aspirante.controller';
import { AspiranteService } from './aspirante.service';

describe('AspiranteController', () => {
  let controller: AspiranteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AspiranteController],
      providers: [AspiranteService],
    }).compile();

    controller = module.get<AspiranteController>(AspiranteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
