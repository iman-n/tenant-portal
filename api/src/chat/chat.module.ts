import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatResolver } from './chat.resolver';
import { RedisModule } from '../redis/redis.module';
import { TicketModule } from '../ticket/ticket.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [RedisModule, TicketModule],
  providers: [ChatService, ChatResolver, PrismaService],
  exports: [ChatService],
})
export class ChatModule {}
