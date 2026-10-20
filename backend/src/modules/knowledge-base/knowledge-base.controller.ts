import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service.js';
import { CreateKnowledgeBaseDto } from './dto/create-knowledge-base.dto.js';
import { UpdateKnowledgeBaseDto } from './dto/update-knowledge-base.dto.js';

@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private readonly kbService: KnowledgeBaseService) {}

  @Get()
  async index() {
    const data = await this.kbService.findAll();
    return { data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() dto: CreateKnowledgeBaseDto) {
    const entry = await this.kbService.create(dto);
    return {
      message: 'Berhasil ditambahkan',
      data: entry,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateKnowledgeBaseDto
  ) {
    await this.kbService.update(id, dto);
    return { message: 'Berhasil diperbarui' };
  }

  @Delete(':id')
  async destroy(@Param('id', ParseIntPipe) id: number) {
    await this.kbService.delete(id);
    return { message: 'Berhasil dihapus' };
  }
}
