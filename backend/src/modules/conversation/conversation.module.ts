import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service.js';

@Module({
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
