import { gql } from '@apollo/client';

export enum TicketStatus {
  OPEN = 'OPEN',
  AI_HANDLING = 'AI_HANDLING',
  STAFF_ASSIGNED = 'STAFF_ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export interface Ticket {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
}


export const GET_TICKETS = gql`
  query GetTickets {
    tickets {
      id
      title
      description
      status
      createdAt
      updatedAt
      messages {
        id
        content
        createdAt
      }
    }
  }
`;

export const GET_FILTERED_TICKETS = gql`
  query FilteredTickets($status: String, $searchTerm: String) {
    tickets(status: $status, searchTerm: $searchTerm) {
      id
      title
      description
      status
      createdAt
      updatedAt
      messages {
        id
        content
        createdAt
      }
    }
  }
`;

export const CREATE_TICKET = gql`
  mutation CreateTicket($createTicketInput: CreateTicketInput!) {
    createTicket(createTicketInput: $createTicketInput) {
      id
      title
      description
      status
    }
  }
`;

export const ADD_MESSAGE = gql`
  mutation AddMessage($addMessageInput: AddMessageInput!) {
    addMessage(addMessageInput: $addMessageInput) {
      id
      content
      createdAt
    }
  }
`;

export const UPDATE_TICKET = gql`
  mutation UpdateTicket($updateTicketInput: UpdateTicketInput!) {
    updateTicket(updateTicketInput: $updateTicketInput) {
      id
      status
    }
  }
`;

export const CHAT_MESSAGE = gql`
  mutation ChatMessage($input: ChatMessageInput!) {
    chatMessage(input: $input) {
      message
      done
    }
  }
`;

export const GET_CONVERSATION_HISTORY = gql`
  query GetConversationHistory($sessionId: String!) {
    getConversationHistory(sessionId: $sessionId) {
      id
      content
      createdAt
    }
  }
`;