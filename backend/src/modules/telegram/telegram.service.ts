import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly token: string;
  private readonly baseUrl: string;
  private readonly http: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.token = this.configService.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.baseUrl = `https://api.telegram.org/bot${this.token}`;
    this.http = axios.create({ timeout: 15000 });
  }

  async sendMessage(chatId: number | string, text: string): Promise<void> {
    if (!this.token) {
      this.logger.warn('TELEGRAM_BOT_TOKEN belum disetel!');
      return;
    }

    try {
      await this.http.post(`${this.baseUrl}/sendMessage`, {
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
      });
    } catch (error: any) {
      this.logger.error(`Telegram sendMessage error: ${error.response?.data?.description || error.message}`);
    }
  }

  async sendTyping(chatId: number | string): Promise<void> {
    if (!this.token) return;

    try {
      await this.http.post(`${this.baseUrl}/sendChatAction`, {
        chat_id: chatId,
        action: 'typing',
      });
    } catch (error: any) {
      this.logger.warn(`Telegram sendTyping error: ${error.response?.data?.description || error.message}`);
    }
  }

  async setWebhook(url: string): Promise<any> {
    if (!this.token) {
      return { ok: false, description: 'TELEGRAM_BOT_TOKEN belum disetel' };
    }

    try {
      const response = await this.http.post(`${this.baseUrl}/setWebhook`, { url });
      return response.data;
    } catch (error: any) {
      return { ok: false, description: error.response?.data?.description || error.message };
    }
  }

  async deleteWebhook(): Promise<any> {
    if (!this.token) {
      return { ok: false, description: 'TELEGRAM_BOT_TOKEN belum disetel' };
    }

    try {
      const response = await this.http.post(`${this.baseUrl}/deleteWebhook`);
      return response.data;
    } catch (error: any) {
      return { ok: false, description: error.response?.data?.description || error.message };
    }
  }
}
