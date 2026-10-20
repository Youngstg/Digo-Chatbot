import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { StoreChatDto } from './dto/store-chat.dto.js';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async store(@Body() dto: StoreChatDto) {
    return this.chatService.processChat(dto);
  }
}
