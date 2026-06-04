import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MateriasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { codigo: string; nombre: string; matriculados: number; programaAcademicoId: number }) {
    return this.prisma.materia.create({
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        matriculados: data.matriculados,
        programa: { connect: { id: data.programaAcademicoId } }
      }
    });
  }

  async findAll() {
    return this.prisma.materia.findMany({
      include: { programa: true },
      orderBy: { id: 'asc' },
    });
  }

  async findOne(id: number) {
    const mat = await this.prisma.materia.findUnique({
      where: { id },
      include: { programa: true },
    });
    if (!mat) throw new NotFoundException(`Materia ${id} no existe`);
    return mat;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.materia.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.materia.delete({ where: { id } });
  }
}