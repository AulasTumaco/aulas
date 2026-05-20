import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgramasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(nombre: string) {
    return this.prisma.programaAcademico.create({ data: { nombre } });
  }

  async findAll() {
    return this.prisma.programaAcademico.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const prog = await this.prisma.programaAcademico.findUnique({
      where: { id },
      include: { materias: true, docentes: true },
    });
    if (!prog) throw new NotFoundException(`Programa ${id} no existe`);
    return prog;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.programaAcademico.delete({ where: { id } });
  }
}