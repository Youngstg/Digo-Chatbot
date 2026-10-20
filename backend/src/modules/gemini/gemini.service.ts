import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private ai: GoogleGenAI | null = null;
  private readonly models: string[] = [];
  private readonly rateLimitCooldownMs = 3600 * 1000; // 1 jam cooldown
  private readonly cooldowns: Map<string, number> = new Map(); // model -> timestamp expire

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      this.logger.warn('GEMINI_API_KEY belum disetel di environment!');
    }

    const primaryModel = this.configService.get<string>('GEMINI_MODEL') || 'gemini-2.5-flash';
    const fallback1 = this.configService.get<string>('GEMINI_FALLBACK_1') || 'gemini-2.0-flash';
    const fallback2 = this.configService.get<string>('GEMINI_FALLBACK_2') || 'gemini-1.5-flash';
    const fallback3 = this.configService.get<string>('GEMINI_FALLBACK_3');

    this.models = [primaryModel, fallback1, fallback2, fallback3].filter(
      (m): m is string => Boolean(m && m.trim().length > 0)
    );
  }

  public getModels(): string[] {
    return [...this.models];
  }

  public isApiKeySet(): boolean {
    return Boolean(this.configService.get<string>('GEMINI_API_KEY'));
  }

  /**
   * Kirim pesan percakapan ke Gemini dengan auto-fallback antar model.
   */
  async chat(messages: ChatMessage[], systemPrompt: string = ''): Promise<string> {
    if (!this.ai) {
      const apiKey = this.configService.get<string>('GEMINI_API_KEY');
      if (apiKey) {
        this.ai = new GoogleGenAI({ apiKey });
      } else {
        return 'Maaf, kunci API AI (GEMINI_API_KEY) belum dikonfigurasi di server.';
      }
    }

    // Format riwayat pesan untuk Google Gen AI SDK
    const contents = messages
      .filter((msg) => msg.role !== 'system')
      .map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }));

    for (const model of this.models) {
      if (this.isRateLimited(model)) {
        this.logger.log(`GeminiService: melewati model ${model} (cooldown aktif)`);
        continue;
      }

      const result = await this.tryModel(model, contents, systemPrompt);
      if (result !== null) {
        return result;
      }
      // result null = rate limited (429/503), lanjut ke model berikutnya
    }

    return 'Maaf, semua model AI sedang sibuk atau kuota tercapai. Silakan coba beberapa saat lagi. 🙏';
  }

  /**
   * Coba panggil model tertentu menggunakan SDK @google/genai
   */
  private async tryModel(
    model: string,
    contents: Array<{ role: string; parts: Array<{ text: string }> }>,
    systemPrompt: string
  ): Promise<string | null> {
    try {
      this.logger.log(`Mengirim request ke Gemini model: ${model}`);

      const response = await this.ai!.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: systemPrompt || undefined,
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });

      const replyText = response.text || '';
      return this.cleanText(replyText);
    } catch (error: any) {
      const statusCode = error?.status || error?.statusCode || error?.response?.status;
      const errorMessage = error?.message || String(error);

      // Cek apakah error karena kuota habis / rate limit
      const isRateLimit =
        statusCode === 429 ||
        statusCode === 503 ||
        errorMessage.includes('429') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('RESOURCE_EXHAUSTED');

      if (isRateLimit) {
        this.logger.warn(`Model ${model} terkena rate limit: ${errorMessage}. Mengaktifkan cooldown.`);
        this.setRateLimit(model);
        return null; // Coba model fallback berikutnya
      }

      this.logger.error(`Error pada model ${model}: ${errorMessage}`, error?.stack);
      // Jika error non-quota (misal prompt violation atau internal error) kembalikan pesan ramah
      return 'Maaf, terjadi kendala saat memproses respons AI. Mohon coba ulangi pertanyaan Anda.';
    }
  }

  private isRateLimited(model: string): boolean {
    const expireTime = this.cooldowns.get(model);
    if (!expireTime) return false;

    if (Date.now() > expireTime) {
      this.cooldowns.delete(model);
      return false;
    }
    return true;
  }

  private setRateLimit(model: string): void {
    this.cooldowns.set(model, Date.now() + this.rateLimitCooldownMs);
  }

  /**
   * Bersihkan format teks (bintang markdown jika ada) agar ramah WhatsApp & Telegram
   */
  private cleanText(text: string): string {
    return text.trim();
  }
}
