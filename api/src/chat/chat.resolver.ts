import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ChatService } from './chat.service';
import { TicketService } from '../ticket/ticket.service';
import {
  ChatMessage,
  ChatMessageInput,
  ChatResponse,
} from './dto/chat-message.input';

@Resolver()
export class ChatResolver {
  constructor(
    private chatService: ChatService,
    private ticketService: TicketService,
  ) {}

  @Query(() => [ChatMessage])
  async getConversationHistory(
    @Args('sessionId') sessionId: string,
  ): Promise<ChatMessage[]> {
    return this.chatService.getConversationHistory(sessionId);
  }

  @Mutation(() => ChatResponse)
  async chatMessage(
    @Args('input') input: ChatMessageInput,
  ): Promise<ChatResponse> {
    try {
      const response = await this.chatService.processUserMessage(
        input.message,
        input.sessionId,
      );

      const conversationHistory = await this.chatService.getConversationHistory(
        input.sessionId,
      );

      // Example of checking conversation progress
      if (conversationHistory.length >= 5) {
        // Create ticket with all messages
        const ticket = await this.chatService.createTicketWithConversation(
          input.sessionId,
        );

        return {
          message: `Ticket created successfully with ID: ${ticket.id}`,
          done: true,
        };
      }

      return {
        message: response.content,
        done: false,
      };
    } catch (error) {
      console.error('Error in chat message:', error);
      throw new Error('Failed to process chat message');
    }
  }

  // Optional: Query to get conversation history
  // @Query(() => [ChatMessage])
  // async getConversationHistory(@Args('sessionId') sessionId: string) {
  //   return await this.chatService.getConversationHistory(sessionId);
  // }
}
