import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ChatMessage } from '../gemini/gemini.service.js';

@Injectable()
export class ConversationService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreate(sessionId: string, userName?: string | null) {
    let conversation = await this.prisma.conversation.findUnique({
      where: { session_id: sessionId },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          session_id: sessionId,
          user_name: userName || null,
        },
      });
    } else if (userName && !conversation.user_name) {
      conversation = await this.prisma.conversation.update({
        where: { id: conversation.id },
        data: { user_name: userName },
      });
    }

    return conversation;
  }

  async addMessage(
    conversationId: bigint | number,
    role: 'user' | 'assistant' | 'system',
    content: string
  ) {
    return this.prisma.message.create({
      data: {
        conversation_id: BigInt(conversationId),
        role,
        content,
      },
    });
  }

  /**
   * Hapus semua pesan dalam conversation (reset context)
   */
  async clearHistory(sessionId: string): Promise<void> {
    const conversation = await this.prisma.conversation.findUnique({
      where: { session_id: sessionId },
    });

    if (conversation) {
      await this.prisma.message.deleteMany({
        where: { conversation_id: conversation.id },
      });
    }
  }

  /**
   * Ambil riwayat percakapan terbaru dalam format ChatMessage untuk LLM.
   */
  async getHistoryForLLM(
    conversationId: bigint | number,
    limit: number = 10
  ): Promise<ChatMessage[]> {
    const messages = await this.prisma.message.findMany({
      where: {
        conversation_id: BigInt(conversationId),
        role: { not: 'system' },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    // Urutkan kembali secara kronologis (dari yang terlama ke terbaru)
    return messages.reverse().map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));
  }
}
