import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly token: string;
  private readonly phoneNumberId: string;
  private readonly apiVersion: string;
  private readonly http: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.token = this.configService.get<string>('WHATSAPP_TOKEN') || '';
    this.phoneNumberId = this.configService.get<string>('WHATSAPP_PHONE_NUMBER_ID') || '';
    this.apiVersion = this.configService.get<string>('WHATSAPP_API_VERSION') || 'v18.0';
    this.http = axios.create({ timeout: 15000 });
  }

  async sendMessage(to: string, text: string): Promise<void> {
    if (!this.token || !this.phoneNumberId) {
      this.logger.warn('WhatsApp Cloud API belum disetel lengkap (WHATSAPP_TOKEN atau WHATSAPP_PHONE_NUMBER_ID kosong)!');
      return;
    }

    try {
      await this.http.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: {
            preview_url: false,
            body: text,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      this.logger.error(`WhatsApp sendMessage error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async markAsRead(messageId: string): Promise<void> {
    if (!this.token || !this.phoneNumberId) return;

    try {
      await this.http.post(
        `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      this.logger.warn(`WhatsApp markAsRead error: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
