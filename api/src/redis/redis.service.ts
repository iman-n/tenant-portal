import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    this.client.connect().catch((err) => {
      console.error('Redis connection error:', err);
    });

    this.client.on('error', (err) => console.error('Redis Client Error', err));
    this.client.on('connect', () => console.log('Redis Client Connected'));
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async storeConversation(sessionId: string, message: any): Promise<void> {
    try {
      const key = `chat:${sessionId}`;
      const conversation = await this.getConversationHistory(sessionId);

      // Add timestamp to message
      const messageWithTimestamp = {
        ...message,
        timestamp: new Date().toISOString(),
      };

      conversation.push(messageWithTimestamp);

      // Store with 1-hour expiration
      await this.client.setEx(
        key,
        3600, // 1 hour TTL
        JSON.stringify(conversation),
      );
    } catch (error) {
      console.error('Error storing conversation:', error);
      throw new Error('Failed to store conversation');
    }
  }

  async getConversationHistory(sessionId: string): Promise<any[]> {
    try {
      const key = `chat:${sessionId}`;
      const data = await this.client.get(key);

      if (!data) {
        return [];
      }

      const conversation = JSON.parse(data);

      // Sort by timestamp if it exists
      return conversation.sort((a: any, b: any) => {
        if (a.timestamp && b.timestamp) {
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        }
        return 0;
      });
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return [];
    }
  }

  async clearConversation(sessionId: string): Promise<void> {
    try {
      const key = `chat:${sessionId}`;
      await this.client.del(key);
    } catch (error) {
      console.error('Error clearing conversation:', error);
      throw new Error('Failed to clear conversation');
    }
  }

  // Helper method to get conversation length
  async getConversationLength(sessionId: string): Promise<number> {
    const conversation = await this.getConversationHistory(sessionId);
    return conversation.length;
  }

  // Helper method to check if conversation exists
  async conversationExists(sessionId: string): Promise<boolean> {
    const key = `chat:${sessionId}`;
    return (await this.client.exists(key)) === 1;
  }
}
