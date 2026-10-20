import { Module } from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service.js';
import { WhatsAppController } from './whatsapp.controller.js';
import { GeminiModule } from '../gemini/gemini.module.js';
import { KnowledgeBaseModule } from '../knowledge-base/knowledge-base.module.js';
import { ConversationModule } from '../conversation/conversation.module.js';

@Module({
  imports: [GeminiModule, KnowledgeBaseModule, ConversationModule],
  controllers: [WhatsAppController],
  providers: [WhatsAppService],
  exports: [WhatsAppService],
})
export class WhatsAppModule {}
