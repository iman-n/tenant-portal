import { InputType, Field } from '@nestjs/graphql';
import { IsOptional, IsEnum } from 'class-validator';
import { TicketStatus } from '../entities/ticket-status.enum';

@InputType()
export class UpdateTicketInput {
  @Field(() => String)
  id: string;

  @Field(() => TicketStatus, { nullable: true })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @Field({ nullable: true })
  @IsOptional()
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;
}
