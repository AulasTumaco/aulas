import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { MateriasService } from './materias.service';

@Controller('materias')
export class MateriasController {
  constructor(private readonly service: MateriasService) {}

  @Post()
  async create(@Body() body: { codigo: string; nombre: string; matriculados: number; programaAcademicoId: number }) {
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