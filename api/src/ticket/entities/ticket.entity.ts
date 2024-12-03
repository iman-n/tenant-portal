import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Message } from './message.entity';
import { TicketStatus } from './ticket-status.enum';

@ObjectType()
export class Ticket {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => TicketStatus)
  status: TicketStatus;

  @Field(() => [Message], { nullable: true })
  messages?: Message[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
