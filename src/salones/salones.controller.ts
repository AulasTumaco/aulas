import {
  Body, Controller, Delete, Get,
  Param, ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { SalonesService } from './salones.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';

@Controller('salones')
export class SalonesController {
  constructor(private readonly service: SalonesService) {}

  // Rutas fijas SIEMPRE antes de :id
  @Get('dashboard')
  dashboard() { return this.service.dashboard(); }

  @Get('alertas')
  alertas() { return this.service.alertas(); }

  @Get('stats')
  stats() { return this.service.stats(); }

  @Post()
  create(@Body() dto: CreateSalonDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSalonDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}