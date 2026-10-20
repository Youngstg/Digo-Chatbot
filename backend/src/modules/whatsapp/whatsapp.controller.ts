import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { WhatsAppService } from './whatsapp.service.js';
import { GeminiService } from '../gemini/gemini.service.js';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service.js';
import { ConversationService } from '../conversation/conversation.service.js';
import { SalesAssistantPrompt } from '../../prompts/sales-assistant.prompt.js';

@Controller('webhook/whatsapp')
export class WhatsAppController {
  private readonly logger = new Logger(WhatsAppController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly whatsAppService: WhatsAppService,
    private readonly geminiService: GeminiService,
    private readonly kbService: KnowledgeBaseService,
    private readonly conversationService: ConversationService
  ) {}

  /**
   * GET /api/webhook/whatsapp - Verifikasi webhook Meta Cloud API
   */
  @Get()
  verify(@Query() query: Record<string, string>, @Res() res: Response) {
    const mode = query['hub.mode'] || query['hub_mode'];
    const token = query['hub.verify_token'] || query['hub_verify_token'];
    const challenge = query['hub.challenge'] || query['hub_challenge'];
    const expectedToken = this.configService.get<string>('WHATSAPP_VERIFY_TOKEN');

    if (mode === 'subscribe' && token === expectedToken) {
      return res.status(HttpStatus.OK).send(challenge);
    }

    return res.status(HttpStatus.FORBIDDEN).json({ error: 'Forbidden' });
  }

  /**
   * POST /api/webhook/whatsapp - Pesan masuk dari Meta WhatsApp Cloud API
   */
  @Post()
  async handleWhatsApp(@Body() body: any) {
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    // Hanya proses pesan teks
    if (!message || message.type !== 'text') {
      return { ok: true };
    }

    const from = message.from; // Nomor WhatsApp pengirim
    const messageId = message.id;
    const text = message.text?.body;
    const contactName = value?.contacts?.[0]?.profile?.name || null;

    // Tandai pesan telah dibaca
    await this.whatsAppService.markAsRead(messageId);

    const sessionId = `wa_${from}`;

    // Jalankan pemrosesan AI di background
    setImmediate(async () => {
      try {
        const conversation = await this.conversationService.getOrCreate(sessionId, contactName);
        await this.conversationService.addMessage(conversation.id, 'user', text);

        const context = await this.kbService.retrieveContext(text);
        const systemPrompt = SalesAssistantPrompt.buildSystemPrompt(context);
        const history = await this.conversationService.getHistoryForLLM(conversation.id, 10);

        const reply = await this.geminiService.chat(history, systemPrompt);

        await this.conversationService.addMessage(conversation.id, 'assistant', reply);
        await this.whatsAppService.sendMessage(from, reply);
      } catch (error: any) {
        this.logger.error(`Error handling WhatsApp message: ${error.message}`, error.stack);
        await this.whatsAppService.sendMessage(from, 'Maaf, terjadi kesalahan. Silakan coba lagi. 🙏');
      }
    });

    return { ok: true };
  }
}
