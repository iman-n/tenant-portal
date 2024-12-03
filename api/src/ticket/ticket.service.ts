import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketInput } from './dto/create-ticket.input';
import { AddMessageInput } from './dto/add-message.input';
import { UpdateTicketInput } from './dto/update-ticket.input';
import { TicketStatus } from './entities/ticket-status.enum';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  async createTicket(createTicketInput: CreateTicketInput) {
    return this.prisma.ticket.create({
      data: createTicketInput,
      include: {
        messages: true,
      },
    });
  }

  async addMessage(addMessageInput: AddMessageInput) {
    return this.prisma.message.create({
      data: addMessageInput,
      include: {
        ticket: true,
      },
    });
  }

  async updateTicket(updateTicketInput: UpdateTicketInput) {
    const { id, ...data } = updateTicketInput;
    return this.prisma.ticket.update({
      where: { id },
      data,
      include: {
        messages: true,
      },
    });
  }

  async findAll(params: { status?: TicketStatus; searchTerm?: string }) {
    const { status, searchTerm } = params;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (searchTerm) {
      where.OR = [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
      ];
    }

    return this.prisma.ticket.findMany({
      where,
      include: {
        messages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // async findAll() {
  //   return this.prisma.ticket.findMany({
  //     include: {
  //       messages: true,
  //     },
  //   });
  // }

  async findOne(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        messages: true,
      },
    });
  }
}
