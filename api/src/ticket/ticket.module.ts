import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolver } from './ticket.resolver';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TicketResolver, TicketService, PrismaService],
  exports: [TicketService],
})
export class TicketModule {}
