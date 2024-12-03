import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';
import { describe, beforeEach, it, expect } from '@jest/globals';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
