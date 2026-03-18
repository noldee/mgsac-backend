import { Test, TestingModule } from '@nestjs/testing';
import { AromasController } from './aromas.controller';

describe('AromasController', () => {
  let controller: AromasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AromasController],
    }).compile();

    controller = module.get<AromasController>(AromasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
