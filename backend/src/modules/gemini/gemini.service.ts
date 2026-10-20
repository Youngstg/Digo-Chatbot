import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import nodeFetch from 'node-fetch';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private ai: GoogleGenAI | null = null;
  private readonly models: string[] = [];
  private readonly rateLimitCooldownMs = 3600 * 1000; // 1 jam cooldown untuk rate limit
  private readonly cooldowns: Map<string, number> = new Map(); // model -> timestamp expire

  // Urutan default fallback berdasarkan kuota akun aktif:
  // 1. gemini-3.8-flash (20 RPD) - Kualitas persona terbaik
  // 2. gemini-3.6-flash (20 RPD) - Cadangan Flash Tier 1
  // 3. gemini-3-flash   (20 RPD) - Cadangan Flash Tier 1
  // 4. gemini-3.1-flash-lite (500 RPD) - Workhorse utama (cepat, kuota besar)
  // 5. gemini-3.5-flash-lite (500 RPD) - Workhorse kedua (cepat, kuota besar)
  // 6. gemini-2.5-flash-lite (20 RPD)  - Cadangan Flash Lite
  // 7. gemma-4-31b-it   (14,400 RPD) - Cadangan Kuota Super (Open Model 31B)
  // 8. gemma-4-26b-it   (14,400 RPD) - Cadangan Kuota Super (Open Model 26B)
  private readonly defaultModels: string[] = [
    'gemini-3.8-flash',
    'gemini-3.6-flash',
    'gemini-3-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-2.5-flash-lite',
    'gemma-4-31b-it',
    'gemma-4-26b-it',
  ];

  constructor(private readonly configService: ConfigService) {
    this.ai = this.createClient();

    // Jika pengguna menyetel GEMINI_MODELS (koma-terpisah), gunakan list tersebut
    const envModels = this.configService.get<string>('GEMINI_MODELS');
    if (envModels && envModels.trim().length > 0) {
      this.models = envModels
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
    } else {
      // Periksa individual keys jika ada kustomisasi spesifik
      const primary = this.configService.get<string>('GEMINI_MODEL');
      const fb1 = this.configService.get<string>('GEMINI_FALLBACK_1');
      const fb2 = this.configService.get<string>('GEMINI_FALLBACK_2');
      const fb3 = this.configService.get<string>('GEMINI_FALLBACK_3');

      const customList = [primary, fb1, fb2, fb3].filter(
        (m): m is string => Boolean(m && m.trim().length > 0)
      );

      if (customList.length > 0) {
        // Gabungkan kustomisasi dengan default models agar rantai fallback tetap lengkap
        const combined = [...customList];
        for (const def of this.defaultModels) {
          if (!combined.includes(def)) {
            combined.push(def);
          }
        }
        this.models = combined;
      } else {
        this.models = [...this.defaultModels];
      }
    }

    this.logger.log(`Daftar rantai model fallback aktif (${this.models.length} model): ${this.models.join(' -> ')}`);
  }

  private createClient(): GoogleGenAI | null {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY belum disetel di environment!');
      return null;
    }

    const baseUrl = this.configService.get<string>('GEMINI_BASE_URL');
    const proxyUrl =
      this.configService.get<string>('GEMINI_PROXY') ||
      this.configService.get<string>('HTTPS_PROXY') ||
      this.configService.get<string>('HTTP_PROXY') ||
      this.configService.get<string>('ALL_PROXY');

    const httpOptions: Record<string, any> = {};

    if (baseUrl && baseUrl.trim().length > 0) {
      httpOptions.baseUrl = baseUrl.trim();
      this.logger.log(`GeminiService menggunakan Base URL custom: ${baseUrl}`);
    }

    if (proxyUrl && proxyUrl.trim().length > 0) {
      const trimmedProxy = proxyUrl.trim();
      const isSocks = trimmedProxy.startsWith('socks');
      const agent = isSocks
        ? new SocksProxyAgent(trimmedProxy)
        : new HttpsProxyAgent(trimmedProxy);

      httpOptions.fetch = (input: any, init?: any) => {
        return (nodeFetch as any)(input, {
          ...init,
          agent,
        });
      };

      this.logger.log(`GeminiService menggunakan Proxy: ${trimmedProxy}`);
    }

    return new GoogleGenAI({
      apiKey,
      ...(Object.keys(httpOptions).length > 0 ? { httpOptions } : {}),
    });
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
      this.ai = this.createClient();
      if (!this.ai) {
        return 'Maaf, kunci API AI (GEMINI_API_KEY) belum dikonfigurasi di server.';
      }
    }

    // Format riwayat pesan dasar untuk Google Gen AI SDK
    const baseContents = messages
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

      const result = await this.tryModel(model, baseContents, systemPrompt);
      if (result !== null) {
        return result;
      }
      // result null = rate limited (429/503) atau model tidak tersedia (404), lanjut ke model berikutnya
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
      this.logger.log(`Mengirim request ke model: ${model}`);

      // Model Gemma biasanya tidak mendukung config.systemInstruction terpisah,
      // sehingga system prompt dimasukkan ke konten pertama
      const isGemma = model.toLowerCase().includes('gemma');
      let instruction: string | undefined = systemPrompt || undefined;
      let targetContents = contents;

      if (isGemma) {
        instruction = undefined;
        if (systemPrompt && targetContents.length > 0) {
          const firstText = targetContents[0].parts[0]?.text || '';
          targetContents = [
            {
              role: 'user',
              parts: [{ text: `[INSTRUKSI]\n${systemPrompt}\n\n[PESAN]\n${firstText}` }],
            },
            ...targetContents.slice(1),
          ];
        }
      }

      const response = await this.ai!.models.generateContent({
        model,
        contents: targetContents,
        config: {
          systemInstruction: instruction,
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
        this.logger.warn(`Model ${model} terkena rate limit: ${errorMessage}. Cooldown aktif.`);
        this.setRateLimit(model);
        return null; // Coba model fallback berikutnya
      }

      // Cek apakah error karena model 404 / deprecated / not found
      const isNotFound =
        statusCode === 404 ||
        errorMessage.includes('404') ||
        errorMessage.includes('NOT_FOUND') ||
        errorMessage.includes('no longer available') ||
        errorMessage.includes('not found');

      if (isNotFound) {
        this.logger.warn(`Model ${model} tidak tersedia/deprecated: ${errorMessage}. Menandai cooldown 24 jam.`);
        this.cooldowns.set(model, Date.now() + 24 * 3600 * 1000);
        return null; // Coba model fallback berikutnya
      }

      if (errorMessage.includes('User location is not supported')) {
        this.logger.error(
          `Google Gemini memblokir IP server karena lokasi wilayah: "User location is not supported". Pastikan Cloudflare WARP aktif dalam proxy mode (warp-cli mode proxy && warp-cli connect) dan GEMINI_PROXY="socks5://127.0.0.1:40000" disetel di .env.`
        );
      }

      this.logger.error(`Error pada model ${model}: ${errorMessage}`, error?.stack);
      // Untuk error lain, coba fallback berikutnya agar chatbot tetap responsif
      return null;
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

  private cleanText(text: string): string {
    return text.trim();
  }
}
