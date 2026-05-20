import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';

@Injectable()
export class SalonesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSalonDto) {
    return this.prisma.salon.create({ data: dto });
  }

  async findAll() {
    return this.prisma.salon.findMany({ orderBy: { id: 'asc' } });
  }

  async findOne(id: number) {
    const salon = await this.prisma.salon.findUnique({
      where: { id },
      include: { reservas: { include: { materia: true, docente: true } } },
    });
    if (!salon) throw new NotFoundException(`Salón ${id} no existe`);
    return salon;
  }

  async update(id: number, dto: UpdateSalonDto) {
    await this.findOne(id);
    return this.prisma.salon.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.salon.delete({ where: { id } });
  }

  async dashboard() {
    const ahora = new Date();
    const salones = await this.prisma.salon.findMany({
      include: {
        reservas: {
          where: {
            horaInicio: { lte: ahora },
            horaFin: { gte: ahora },
          },
          include: { materia: true, docente: true },
        },
      },
    });

    return salones.map((salon) => {
      const reservaActiva = salon.reservas[0] ?? null;
      const estado = reservaActiva ? reservaActiva.estado : 'LIBRE';
      const alerta =
        reservaActiva && reservaActiva.materia.matriculados > salon.capacidad
          ? `SOBRECUPO: ${reservaActiva.materia.matriculados} estudiantes, capacidad ${salon.capacidad}`
          : null;
      return {
        id: salon.id,
        codigo: salon.codigo,
        nombre: salon.nombre,
        edificio: salon.edificio,
        capacidad: salon.capacidad,
        estado,
        reservaActiva,
        alerta,
      };
    });
  }

  async alertas() {
    const ahora = new Date();
    const reservas = await this.prisma.reserva.findMany({
      where: {
        horaInicio: { lte: ahora },
        horaFin: { gte: ahora },
      },
      include: { salon: true, materia: true, docente: true },
    });

    return reservas
      .filter((r) => r.materia.matriculados > r.salon.capacidad)
      .map((r) => ({
        tipo: 'SOBRECUPO',
        salon: r.salon.nombre,
        materia: r.materia.nombre,
        matriculados: r.materia.matriculados,
        capacidad: r.salon.capacidad,
        docente: r.docente.nombreCompleto,
        libreA: r.horaFin,
      }));
  }
}