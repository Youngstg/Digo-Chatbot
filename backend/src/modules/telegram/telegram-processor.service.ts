import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import { GeminiService } from '../gemini/gemini.service.js';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service.js';
import { ConversationService } from '../conversation/conversation.service.js';
import { QueueService, TelegramJobData } from '../queue/queue.service.js';
import { SalesAssistantPrompt } from '../../prompts/sales-assistant.prompt.js';

@Injectable()
export class TelegramProcessorService implements OnModuleInit {
  private readonly logger = new Logger(TelegramProcessorService.name);

  private readonly WELCOME_MESSAGE =
    "Halo! 👋 Selamat datang di Digital Agency kami.\n\nSaya Digo, AI Sales Assistant yang siap membantu Anda menemukan layanan digital yang tepat.\n\nAda yang bisa saya bantu? 😊\n\nKetik /help untuk melihat daftar perintah.";

  private readonly HELP_MESSAGE =
    "Perintah yang tersedia:\n\n/start - Mulai percakapan baru\n/clear - Hapus riwayat percakapan\n/end   - Akhiri sesi percakapan\n/help  - Tampilkan perintah ini";

  constructor(
    private readonly telegramService: TelegramService,
    private readonly geminiService: GeminiService,
    private readonly kbService: KnowledgeBaseService,
    private readonly conversationService: ConversationService,
    private readonly queueService: QueueService
  ) {}

  onModuleInit() {
    // Daftarkan handler ini ke queue service
    this.queueService.registerTelegramProcessor((data) => this.processMessage(data));
  }

  async processMessage(data: TelegramJobData): Promise<void> {
    const { chatId, text, userName, sessionId } = data;

    // Cek apakah pesan adalah command bot (diawali dengan '/')
    if (text.startsWith('/')) {
      await this.handleCommand(chatId, text, userName, sessionId);
      return;
    }

    // Proses pesan biasa dengan AI
    try {
      await this.telegramService.sendTyping(chatId);

      const conversation = await this.conversationService.getOrCreate(sessionId, userName);
      await this.conversationService.addMessage(conversation.id, 'user', text);

      const context = await this.kbService.retrieveContext(text);
      const systemPrompt = SalesAssistantPrompt.buildSystemPrompt(context);
      const history = await this.conversationService.getHistoryForLLM(conversation.id, 10);

      const reply = await this.geminiService.chat(history, systemPrompt);

      await this.conversationService.addMessage(conversation.id, 'assistant', reply);
      await this.telegramService.sendMessage(chatId, reply);
    } catch (error: any) {
      this.logger.error(`Error processing Telegram message: ${error.message}`, error.stack);
      await this.telegramService.sendMessage(
        chatId,
        'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi. 🙏'
      );
    }
  }

  private async handleCommand(
    chatId: number | string,
    command: string,
    userName?: string | null,
    sessionId?: string
  ): Promise<void> {
    const cmd = command.trim().split(' ')[0].split('@')[0].toLowerCase();

    switch (cmd) {
      case '/start':
        if (sessionId) await this.conversationService.clearHistory(sessionId);
        await this.telegramService.sendMessage(chatId, this.WELCOME_MESSAGE);
        break;

      case '/clear':
        if (sessionId) await this.conversationService.clearHistory(sessionId);
        await this.telegramService.sendMessage(
          chatId,
          "Riwayat percakapan telah dihapus. ✅\n\nSilakan mulai percakapan baru!"
        );
        break;

      case '/end':
        if (sessionId) await this.conversationService.clearHistory(sessionId);
        const nameGreeting = userName ? `, ${userName}` : '';
        await this.telegramService.sendMessage(
          chatId,
          `Terima kasih${nameGreeting}! Sesi percakapan telah diakhiri. 👋\n\nJika ingin memulai lagi, ketik /start kapan saja.`
        );
        break;

      case '/help':
        await this.telegramService.sendMessage(chatId, this.HELP_MESSAGE);
        break;

      default:
        await this.telegramService.sendMessage(
          chatId,
          'Perintah tidak dikenal. Ketik /help untuk melihat perintah yang tersedia.'
        );
        break;
    }
  }
}
