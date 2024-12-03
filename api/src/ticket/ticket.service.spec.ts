import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { describe, beforeEach, it, expect } from '@jest/globals';

describe('TicketService', () => {
  let service: TicketService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketService],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
