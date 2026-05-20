import {
  Body, Controller, Post, Get, Param,
  ParseIntPipe, Patch, Delete, HttpCode
} from '@nestjs/common';
import { SalonesService } from './salones.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';

@Controller('salones')
export class SalonesController {
  constructor(private readonly salonesService: SalonesService) {}

  @Post()
  create(@Body() dto: CreateSalonDto) { return this.salonesService.create(dto); }

  @Get()
  findAll() { return this.salonesService.findAll(); }
  @Get('dashboard')
  async dashboard() { return this.salonesService.dashboard(); }

  @Get('alertas')
  async alertas() { return this.salonesService.alertas(); }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.salonesService.findOne(id); }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateSalonDto) {
    return this.salonesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    this.salonesService.remove(id);
  }
}