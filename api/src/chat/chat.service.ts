// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class ChatService {
  private openai: OpenAI;

  constructor(
    private redisService: RedisService,
    private prisma: PrismaService,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async processUserMessage(message: string, sessionId: string): Promise<any> {
    try {
      const conversationHistory = await this.getConversationHistory(sessionId);

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that helps users create support tickets. Ask relevant questions to gather information about their issue.',
          },
          ...conversationHistory,
          { role: 'user', content: message },
        ],
      });

      const response = completion.choices[0].message;

      // Store both user message and assistant response
      await this.redisService.storeConversation(sessionId, {
        role: 'user',
        content: message,
      });
      await this.redisService.storeConversation(sessionId, response);

      return response;
    } catch (error) {
      throw new Error(`Failed to process message: ${error.message}`);
    }
  }

  async createTicketWithConversation(sessionId: string): Promise<any> {
    const conversationHistory = await this.getConversationHistory(sessionId);
    const ticketData = await this.analyzeConversationForTicket(sessionId);

    // Create ticket with messages in a single transaction
    const ticket = await this.prisma.$transaction(async (prisma) => {
      // Create the ticket
      const newTicket = await prisma.ticket.create({
        data: {
          title: ticketData.title,
          description: ticketData.description,
          status: 'OPEN',
        },
      });

      // Create messages for each conversation entry
      for (const message of conversationHistory) {
        await prisma.message.create({
          data: {
            content: `${message.role}: ${message.content}`,
            ticketId: newTicket.id,
          },
        });
      }

      return newTicket;
    });

    // Clear Redis conversation after successful ticket creation
    await this.redisService.clearConversation(sessionId);

    return ticket;
  }

  async getConversationHistory(sessionId: string): Promise<any[]> {
    try {
      const history = await this.redisService.getConversationHistory(sessionId);
      return history || [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }

  async analyzeConversationForTicket(sessionId: string) {
    const conversationHistory = await this.getConversationHistory(sessionId);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Analyze the conversation and extract key information for a support ticket. Return a JSON object with title, and description',
        },
        ...conversationHistory,
      ],
    });

    try {
      return JSON.parse(completion.choices[0].message.content);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error('Failed to parse ticket information from conversation');
    }
  }
}
