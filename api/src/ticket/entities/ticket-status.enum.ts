import { registerEnumType } from '@nestjs/graphql';

export enum TicketStatus {
  OPEN = 'OPEN',
  AI_HANDLING = 'AI_HANDLING',
  STAFF_ASSIGNED = 'STAFF_ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

registerEnumType(TicketStatus, {
  name: 'TicketStatus',
  description: 'The status of a ticket',
});
