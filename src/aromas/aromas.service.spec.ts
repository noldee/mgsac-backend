import { Test, TestingModule } from '@nestjs/testing';
import { AromasService } from './aromas.service';

describe('AromasService', () => {
  let service: AromasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AromasService],
    }).compile();

    service = module.get<AromasService>(AromasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
