import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { ChatController } from './chat.controller.js';
import { ConversationModule } from '../conversation/conversation.module.js';
import { KnowledgeBaseModule } from '../knowledge-base/knowledge-base.module.js';
import { GeminiModule } from '../gemini/gemini.module.js';

@Module({
  imports: [ConversationModule, KnowledgeBaseModule, GeminiModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
