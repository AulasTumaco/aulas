import {
  Body, Controller, Delete, Get,
  Param, ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { ReservasService } from './reservas.service';

@Controller('reservas')
export class ReservasController {
  constructor(private readonly service: ReservasService) {}

  @Post()
  create(@Body() body: any) { return this.service.create(body); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get('limpiar-vencidas')
  limpiarVencidas() { return this.service.limpiarVencidas(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }

  @Get('salon/:id/horario')
  horario(@Param('id', ParseIntPipe) id: number) {
    return this.service.horarioSemanal(id);
  }
}