import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TicketService } from './ticket.service';
import { Ticket } from './entities/ticket.entity';
import { TicketStatus } from './entities/ticket-status.enum';
import { Message } from './entities/message.entity';
import { CreateTicketInput } from './dto/create-ticket.input';
import { AddMessageInput } from './dto/add-message.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { registerEnumType } from '@nestjs/graphql';

registerEnumType(TicketStatus, {
  name: 'TicketStatus',
});

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  @Mutation(() => Ticket)
  createTicket(
    @Args('createTicketInput') createTicketInput: CreateTicketInput,
  ) {
    return this.ticketService.createTicket(createTicketInput);
  }

  @Mutation(() => Message)
  addMessage(@Args('addMessageInput') addMessageInput: AddMessageInput) {
    return this.ticketService.addMessage(addMessageInput);
  }

  @Mutation(() => Ticket)
  updateTicket(
    @Args('updateTicketInput') updateTicketInput: UpdateTicketInput,
  ) {
    return this.ticketService.updateTicket(updateTicketInput);
  }

  @Query(() => [Ticket])
  async tickets(
    @Args('status', { nullable: true }) status?: TicketStatus,
    @Args('searchTerm', { nullable: true }) searchTerm?: string,
  ) {
    return this.ticketService.findAll({ status, searchTerm });
  }

  @Query(() => Ticket)
  ticket(@Args('id') id: string) {
    return this.ticketService.findOne(id);
  }
}
