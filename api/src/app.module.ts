import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TicketModule } from './ticket/ticket.module';
import { ChatModule } from './chat/chat.module';
import { RedisModule } from './redis/redis.module';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      csrfPrevention: false,
    }),
    RedisModule,
    TicketModule,
    ChatModule,
  ],
})
export class AppModule {}
