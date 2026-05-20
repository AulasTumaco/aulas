import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ReservasService } from './reservas.service';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @Post()
  async create(@Body() body: any) { return this.service.create(body); }

  @Get()
  async findAll() { return this.service.findAll(); }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }

  @Get('salon/:id/horario')
  async horario(@Param('id', ParseIntPipe) id: number) {
    return this.service.horarioSemanal(id);
  }
}