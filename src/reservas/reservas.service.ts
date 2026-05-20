import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoReserva } from '@prisma/client';

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    salonId: number; materiaId: number; docenteId: number;
    fecha: string; horaInicio: string; horaFin: string;
    estado?: EstadoReserva;
  }) {
    return this.prisma.reserva.create({
      data: {
        salonId: data.salonId,
        materiaId: data.materiaId,
        docenteId: data.docenteId,
        fecha: new Date(data.fecha),
        horaInicio: new Date(data.horaInicio),
        horaFin: new Date(data.horaFin),
        estado: data.estado ?? 'RESERVADO',
      },
      include: { salon: true, materia: true, docente: true },
    });
  }

  async findAll() {
    return this.prisma.reserva.findMany({
      include: { salon: true, materia: true, docente: true },
      orderBy: { horaInicio: 'asc' },
    });
  }

  async findOne(id: number) {
    const res = await this.prisma.reserva.findUnique({
      where: { id },
      include: { salon: true, materia: true, docente: true },
    });
    if (!res) throw new NotFoundException(`Reserva ${id} no existe`);
    return res;
  }

  async update(id: number, data: any) {
    await this.findOne(id);
    return this.prisma.reserva.update({ where: { id }, data });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reserva.delete({ where: { id } });
  }

  async horarioSemanal(salonId: number) {
    return this.prisma.reserva.findMany({
      where: { salonId },
      include: { materia: true, docente: true },
      orderBy: { horaInicio: 'asc' },
    });
  }
}