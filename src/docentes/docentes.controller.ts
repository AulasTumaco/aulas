import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DocentesService } from './docentes.service';

@Controller('docentes')
export class DocentesController {
  constructor(private readonly service: DocentesService) {}

  @Post()
  async create(@Body() body: { nombreCompleto: string; correo: string; programaAcademicoId: number }) {
    return this.service.create(body);
  }

  @Get()
  async findAll() { return this.service.findAll(); }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}