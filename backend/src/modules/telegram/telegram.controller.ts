import { Body, Controller, Post, Req } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import { QueueService } from '../queue/queue.service.js';

@Controller('webhook/telegram')
export class TelegramController {
  private readonly processedUpdates = new Map<number, number>(); // update_id -> expireTimestamp

  constructor(
    private readonly telegramService: TelegramService,
    private readonly queueService: QueueService
  ) {}

  @Post()
  async handle(@Body() update: any) {
    // Hanya proses update yang berisi pesan teks biasa
    if (!update || !update.message || !update.message.text) {
      return { ok: true };
    }

    const updateId = update.update_id;

    // Deduplication: cegah pesan duplikat diproses ulang
    if (this.isDuplicate(updateId)) {
      return { ok: true };
    }

    const chatId = update.message.chat.id;
    const text = update.message.text;
    const firstName = update.message.from?.first_name || '';
    const lastName = update.message.from?.last_name || '';
    const userName = `${firstName} ${lastName}`.trim() || null;
    const sessionId = `tg_${chatId}`;

    // Kirim ke antrean background secara asinkron agar Telegram langsung menerima 200 OK
    await this.queueService.dispatchTelegramMessage({
      chatId,
      text,
      userName,
      sessionId,
    });

    return { ok: true };
  }

  @Post('set')
  async setWebhook(@Body('url') customUrl?: string) {
    const url = customUrl || 'http://localhost:8000/api/webhook/telegram';
    return this.telegramService.setWebhook(url);
  }

  @Post('delete')
  async deleteWebhook() {
    return this.telegramService.deleteWebhook();
  }

  private isDuplicate(updateId: number): boolean {
    const now = Date.now();
    const expire = this.processedUpdates.get(updateId);

    if (expire && now < expire) {
      return true;
    }

    // Simpan selama 24 jam
    this.processedUpdates.set(updateId, now + 24 * 3600 * 1000);

    // Bersihkan entri lama jika Map terlalu besar (> 10,000 item)
    if (this.processedUpdates.size > 10000) {
      for (const [id, exp] of this.processedUpdates.entries()) {
        if (now > exp) this.processedUpdates.delete(id);
      }
    }

    return false;
  }
}
