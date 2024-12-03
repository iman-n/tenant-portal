import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Ticket } from './ticket.entity';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field(() => Ticket)
  ticket: Ticket;

  @Field()
  ticketId: string;

  @Field()
  createdAt: Date;
}
