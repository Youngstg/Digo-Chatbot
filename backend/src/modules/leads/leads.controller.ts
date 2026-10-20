import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { LeadsService } from './leads.service.js';
import { CreateLeadDto } from './dto/create-lead.dto.js';
import { UpdateLeadStatusDto } from './dto/update-lead-status.dto.js';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Get()
  async index() {
    const data = await this.leadsService.findAll();
    return { data };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async store(@Body() dto: CreateLeadDto) {
    const lead = await this.leadsService.create(dto);
    return {
      message: 'Lead berhasil disimpan',
      data: lead,
    };
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLeadStatusDto
  ) {
    await this.leadsService.updateStatus(id, dto.status);
    return { message: 'Status lead berhasil diperbarui' };
  }
}
