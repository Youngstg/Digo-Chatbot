import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const leads = await this.prisma.lead.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        conversation: true,
      },
    });

    return leads.map((lead) => ({
      ...lead,
      id: Number(lead.id),
      conversation_id: lead.conversation_id ? Number(lead.conversation_id) : null,
      conversation: lead.conversation
        ? {
            ...lead.conversation,
            id: Number(lead.conversation.id),
          }
        : null,
    }));
  }

  async create(dto: CreateLeadDto) {
    const lead = await this.prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email || null,
        phone: dto.phone || null,
        business_type: dto.business_type || null,
        requirement: dto.requirement || null,
        budget: dto.budget || null,
        conversation_id: dto.conversation_id ? BigInt(dto.conversation_id) : null,
        status: 'new',
      },
    });

    return {
      ...lead,
      id: Number(lead.id),
      conversation_id: lead.conversation_id ? Number(lead.conversation_id) : null,
    };
  }

  async updateStatus(id: number | bigint, status: string) {
    await this.prisma.lead.update({
      where: { id: BigInt(id) },
      data: { status },
    });
    return true;
  }
}
