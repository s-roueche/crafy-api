import { Test, TestingModule } from '@nestjs/testing';
import { CrasController } from './cras.controller';

describe('CrasController', () => {
  let controller: CrasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CrasController],
    }).compile();

    controller = module.get<CrasController>(CrasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
