import { Test, TestingModule } from '@nestjs/testing';
import { CrasService } from './cras.service';

describe('CrasService', () => {
  let service: CrasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CrasService],
    }).compile();

    service = module.get<CrasService>(CrasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
