import { InputType, Field, ObjectType } from '@nestjs/graphql';

@InputType()
export class ChatMessageInput {
  @Field()
  message: string;

  @Field()
  sessionId: string;
}

@ObjectType()
export class ChatMessage {
  @Field()
  role: string;

  @Field()
  content: string;

  @Field()
  timestamp: string;
}

@ObjectType()
export class ChatResponse {
  @Field()
  message: string;

  @Field()
  done: boolean;
}
