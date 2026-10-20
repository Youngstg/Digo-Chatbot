import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, Job } from 'bullmq';
import { Redis } from 'ioredis';

export interface TelegramJobData {
  chatId: number | string;
  text: string;
  userName?: string | null;
  sessionId: string;
}

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private redisClient: Redis | null = null;
  private telegramQueue: Queue | null = null;
  private telegramWorker: Worker | null = null;
  private isRedisAvailable = false;
  private messageProcessorCallback: ((data: TelegramJobData) => Promise<void>) | null = null;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const host = this.configService.get<string>('REDIS_HOST') || '127.0.0.1';
    const port = Number(this.configService.get<number>('REDIS_PORT')) || 6379;
    const password = this.configService.get<string>('REDIS_PASSWORD') || undefined;

    try {
      this.redisClient = new Redis({
        host,
        port,
        password,
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        retryStrategy: (times) => {
          if (times > 3) {
            this.logger.warn(`Redis tidak terhubung di ${host}:${port}. Mengalihkan background queue ke mode in-memory.`);
            return null; // Stop retrying
          }
          return Math.min(times * 100, 2000);
        },
      });

      this.redisClient.on('error', (err) => {
        if (!this.isRedisAvailable) {
          // Hanya log sekali saat initial connect gagal
          this.logger.warn(`Koneksi Redis (${host}:${port}) tidak aktif. Antrean berjalan dalam mode in-memory (aman untuk dev lokal).`);
        }
        this.isRedisAvailable = false;
      });

      this.redisClient.on('connect', () => {
        this.logger.log(`Koneksi Redis ke ${host}:${port} berhasil aktif.`);
        this.isRedisAvailable = true;
        this.initBullMQ();
      });
    } catch (err: any) {
      this.logger.warn(`Gagal inisialisasi Redis client: ${err.message}. Menggunakan in-memory queue.`);
      this.isRedisAvailable = false;
    }
  }

  private initBullMQ() {
    if (!this.redisClient || this.telegramQueue) return;

    try {
      this.telegramQueue = new Queue('telegram-messages', {
        connection: this.redisClient,
      });

      if (this.messageProcessorCallback) {
        this.startWorker(this.messageProcessorCallback);
      }
    } catch (err: any) {
      this.logger.error(`Gagal menginisialisasi antrean BullMQ: ${err.message}`);
    }
  }

  /**
   * Daftarkan handler fungsi yang akan memproses pesan Telegram
   */
  public registerTelegramProcessor(handler: (data: TelegramJobData) => Promise<void>) {
    this.messageProcessorCallback = handler;
    if (this.isRedisAvailable && this.redisClient && !this.telegramWorker) {
      this.startWorker(handler);
    }
  }

  private startWorker(handler: (data: TelegramJobData) => Promise<void>) {
    if (!this.redisClient) return;

    this.telegramWorker = new Worker(
      'telegram-messages',
      async (job: Job<TelegramJobData>) => {
        await handler(job.data);
      },
      { connection: this.redisClient }
    );

    this.telegramWorker.on('completed', (job) => {
      this.logger.log(`Job Telegram selesai diproses: ID ${job.id}`);
    });

    this.telegramWorker.on('failed', (job, err) => {
      this.logger.error(`Job Telegram gagal: ID ${job?.id}, Error: ${err.message}`);
    });
  }

  /**
   * Kirim pesan ke antrean background
   */
  async dispatchTelegramMessage(data: TelegramJobData): Promise<void> {
    if (this.isRedisAvailable && this.telegramQueue) {
      try {
        await this.telegramQueue.add('process-message', data, {
          removeOnComplete: true,
          removeOnFail: 100,
          attempts: 1,
        });
        return;
      } catch (err: any) {
        this.logger.warn(`Gagal enqueue ke Redis: ${err.message}. Menjalankan via fallback in-memory.`);
      }
    }

    // Fallback: jalankan secara asinkron di background tanpa memblokir respons webhook
    if (this.messageProcessorCallback) {
      setImmediate(async () => {
        try {
          await this.messageProcessorCallback!(data);
        } catch (err: any) {
          this.logger.error(`Fallback background processor error: ${err.message}`, err.stack);
        }
      });
    }
  }

  async onModuleDestroy() {
    if (this.telegramWorker) await this.telegramWorker.close();
    if (this.telegramQueue) await this.telegramQueue.close();
    if (this.redisClient) await this.redisClient.quit();
  }
}
