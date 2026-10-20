import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { ConversationService } from '../conversation/conversation.service.js';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service.js';
import { GeminiService } from '../gemini/gemini.service.js';
import { SalesAssistantPrompt } from '../../prompts/sales-assistant.prompt.js';
import { StoreChatDto } from './dto/store-chat.dto.js';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly conversationService: ConversationService,
    private readonly kbService: KnowledgeBaseService,
    private readonly geminiService: GeminiService
  ) {}

  async processChat(dto: StoreChatDto) {
    const sessionId = dto.session_id || uuidv4();
    const userMessage = dto.message;
    const userName = dto.user_name || null;

    try {
      // 1. Get or create conversation
      const conversation = await this.conversationService.getOrCreate(sessionId, userName);

      // 2. Save user message
      await this.conversationService.addMessage(conversation.id, 'user', userMessage);

      // 3. Retrieve relevant knowledge base context
      const context = await this.kbService.retrieveContext(userMessage);

      // 4. Build system prompt with context
      const systemPrompt = SalesAssistantPrompt.buildSystemPrompt(context);

      // 5. Get conversation history for LLM (last 10 messages)
      const history = await this.conversationService.getHistoryForLLM(conversation.id, 10);

      // 6. Send to Gemini using official SDK with multi-model fallback
      const aiResponse = await this.geminiService.chat(history, systemPrompt);

      // 7. Save AI response
      await this.conversationService.addMessage(conversation.id, 'assistant', aiResponse);

      return {
        reply: aiResponse,
        session_id: sessionId,
        conversation_id: Number(conversation.id),
      };
    } catch (error: any) {
      this.logger.error(`Chat processing error: ${error.message}`, error.stack);
      throw error;
    }
  }
}
