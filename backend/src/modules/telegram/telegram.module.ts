import { Module } from '@nestjs/common';
import { TelegramService } from './telegram.service.js';
import { TelegramProcessorService } from './telegram-processor.service.js';
import { TelegramController } from './telegram.controller.js';
import { GeminiModule } from '../gemini/gemini.module.js';
import { KnowledgeBaseModule } from '../knowledge-base/knowledge-base.module.js';
import { ConversationModule } from '../conversation/conversation.module.js';

@Module({
  imports: [GeminiModule, KnowledgeBaseModule, ConversationModule],
  controllers: [TelegramController],
  providers: [TelegramService, TelegramProcessorService],
  exports: [TelegramService],
})
export class TelegramModule {}
