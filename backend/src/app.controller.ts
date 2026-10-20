import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
import { GeminiService } from './modules/gemini/gemini.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService
  ) {}

  @Get()
  getRoot() {
    return {
      name: 'Digo AI Sales Assistant API',
      version: '1.0.0',
      framework: 'NestJS',
      status: 'healthy',
    };
  }

  @Get('health')
  async getHealth() {
    const checks: Record<string, any> = {};

    // Database check
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      checks.database = 'ok';
    } catch (e: any) {
      checks.database = `fail: ${e.message}`;
    }

    // Gemini check
    checks.gemini_key_set = this.geminiService.isApiKeySet() ? 'yes' : 'NO - set GEMINI_API_KEY!';
    checks.gemini_models = this.geminiService.getModels();

    return checks;
  }
}
