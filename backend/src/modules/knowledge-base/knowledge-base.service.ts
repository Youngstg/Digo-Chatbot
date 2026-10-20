import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto.js';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto.js';

@Injectable()
export class KnowledgeBaseService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieve relevant knowledge base context based on user query.
   */
  async retrieveContext(query: string): Promise<string> {
    const trimmedQuery = query.trim();

    // Ambil maksimal 3 knowledge base aktif yang cocok
    const knowledgeEntries = await this.prisma.knowledgeBase.findMany({
      where: {
        is_active: true,
        OR: [
          { title: { contains: trimmedQuery } },
          { content: { contains: trimmedQuery } },
        ],
      },
      take: 3,
    });

    // Ambil layanan aktif yang cocok
    let services = await this.prisma.service.findMany({
      where: {
        is_active: true,
        OR: [
          { name: { contains: trimmedQuery } },
          { description: { contains: trimmedQuery } },
        ],
      },
      include: {
        features: true,
        pricing: true,
      },
      take: 3,
    });

    // Jika tidak ada layanan yang cocok secara spesifik, ambil semua layanan aktif sebagai konteks umum
    if (services.length === 0) {
      services = await this.prisma.service.findMany({
        where: { is_active: true },
        include: {
          features: true,
          pricing: true,
        },
      });
    }

    return this.formatContext(knowledgeEntries, services);
  }

  public formatContext(knowledgeEntries: any[] = [], services: any[] = []): string {
    let context = '';

    if (services.length > 0) {
      context += '=== LAYANAN TERSEDIA ===\n';
      for (const service of services) {
        context += `\n[${service.name}]\n`;
        context += `Deskripsi: ${service.description}\n`;
        const startingPrice = Number(service.starting_price || 0).toLocaleString('id-ID');
        context += `Harga Mulai: Rp ${startingPrice}\n`;
        context += `Durasi: ${service.duration}\n`;

        if (service.features && service.features.length > 0) {
          context += 'Fitur:\n';
          for (const feature of service.features) {
            context += `- ${feature.feature_name}`;
            if (feature.feature_description) {
              context += `: ${feature.feature_description}`;
            }
            context += '\n';
          }
        }
      }
    }

    if (knowledgeEntries.length > 0) {
      context += '\n=== INFORMASI TAMBAHAN ===\n';
      for (const entry of knowledgeEntries) {
        context += `\n[${entry.title}]\n${entry.content}\n`;
      }
    }

    return context;
  }

  async getAllContext(): Promise<string> {
    const services = await this.prisma.service.findMany({
      where: { is_active: true },
      include: {
        features: true,
        pricing: true,
      },
    });

    const entries = await this.prisma.knowledgeBase.findMany({
      where: { is_active: true },
    });

    return this.formatContext(entries, services);
  }

  // CRUD Methods
  async findAll() {
    const list = await this.prisma.knowledgeBase.findMany({
      orderBy: { created_at: 'desc' },
    });
    return list.map((item) => ({
      ...item,
      id: Number(item.id),
    }));
  }

  async create(dto: CreateKnowledgeBaseDto) {
    const created = await this.prisma.knowledgeBase.create({
      data: {
        category: dto.category,
        title: dto.title,
        content: dto.content,
        is_active: true,
      },
    });
    return {
      ...created,
      id: Number(created.id),
    };
  }

  async update(id: number | bigint, dto: UpdateKnowledgeBaseDto) {
    const updated = await this.prisma.knowledgeBase.update({
      where: { id: BigInt(id) },
      data: {
        ...(dto.category !== undefined && { category: dto.category }),
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.content !== undefined && { content: dto.content }),
        ...(dto.is_active !== undefined && { is_active: dto.is_active }),
      },
    });
    return {
      ...updated,
      id: Number(updated.id),
    };
  }

  async delete(id: number | bigint) {
    await this.prisma.knowledgeBase.delete({
      where: { id: BigInt(id) },
    });
    return true;
  }
}
