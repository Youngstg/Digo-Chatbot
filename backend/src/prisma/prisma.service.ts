import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('Koneksi ke database MySQL berhasil terhubung.');
    } catch (error: any) {
      this.logger.warn(
        `Koneksi awal database MySQL belum berhasil: ${error.message}. Pastikan DATABASE_URL di file .env sudah sesuai dengan kredensial MySQL Anda.`
      );
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
