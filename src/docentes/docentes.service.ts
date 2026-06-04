import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocentesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { nombreCompleto: string; correo: string; programaAcademicoId: number }) {
    return this.prisma.docente.create({
      data: {
        nombreCompleto: data.nombreCompleto,
        // Si tu modelo no tiene campo 'correo', elimina esta línea
        programa: { connect: { id: data.programaAcademicoId } }
      }
    });
  }

  async findAll() {
    return this.prisma.docente.findMany({ include: { programa: true } });
  }

  async findOne(id: number) {
    const doc = await this.prisma.docente.findUnique({ where: { id }, include: { programa: true } });
    if (!doc) throw new NotFoundException(`Docente ${id} no encontrado`);
    return doc;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.docente.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.docente.delete({ where: { id } });
  }
}