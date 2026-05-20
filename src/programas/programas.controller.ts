import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProgramasService } from './programas.service';

@Controller('programas')
export class ProgramasController {
  constructor(private readonly service: ProgramasService) {}

  @Post()
  async create(@Body() body: { nombre: string }) {
    return this.service.create(body.nombre);
  }

  @Get()
  async findAll() { return this.service.findAll(); }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}