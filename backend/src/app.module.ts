import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { QueueModule } from './modules/queue/queue.module.js';
import { GeminiModule } from './modules/gemini/gemini.module.js';
import { ConversationModule } from './modules/conversation/conversation.module.js';
import { KnowledgeBaseModule } from './modules/knowledge-base/knowledge-base.module.js';
import { LeadsModule } from './modules/leads/leads.module.js';
import { ChatModule } from './modules/chat/chat.module.js';
import { TelegramModule } from './modules/telegram/telegram.module.js';
import { WhatsAppModule } from './modules/whatsapp/whatsapp.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    QueueModule,
    GeminiModule,
    ConversationModule,
    KnowledgeBaseModule,
    LeadsModule,
    ChatModule,
    TelegramModule,
    WhatsAppModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
