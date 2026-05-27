import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSalonDto } from './dto/create-salon.dto';
import { UpdateSalonDto } from './dto/update-salon.dto';

function ahoraColombia(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
}

function fmtHora(fecha: Date): string {
  return new Date(fecha).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Bogota',
  });
}

function fmtFecha(fecha: Date): string {
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    timeZone: 'America/Bogota',
  });
}

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
      include: {
        reservas: {
          include: { materia: true, docente: true },
          orderBy: { horaInicio: 'asc' },
        },
      },
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
    const ahora = ahoraColombia();

    const hoy = new Date(ahora);
    hoy.setHours(0, 0, 0, 0);
    const en7dias = new Date(hoy);
    en7dias.setDate(en7dias.getDate() + 7);

    const salones = await this.prisma.salon.findMany({
      include: {
        reservas: {
          include: { materia: true, docente: true },
          orderBy: { horaInicio: 'asc' },
        },
      },
      orderBy: { id: 'asc' },
    });

    return salones.map((salon) => {
      const reservaActiva =
        salon.reservas.find((r) => {
          const inicio = new Date(r.horaInicio);
          const fin = new Date(r.horaFin);
          return ahora >= inicio && ahora <= fin;
        }) ?? null;

      const proximaReserva =
        salon.reservas.find((r) => new Date(r.horaInicio) > ahora) ?? null;

      const estado: 'OCUPADO' | 'RESERVADO' | 'LIBRE' = reservaActiva
        ? (reservaActiva.estado as 'OCUPADO' | 'RESERVADO' | 'LIBRE')
        : proximaReserva
        ? 'RESERVADO'
        : 'LIBRE';

      const sobrecupo =
        reservaActiva !== null &&
        reservaActiva.materia.matriculados > salon.capacidad;

      const alerta = sobrecupo
        ? `SOBRECUPO: ${reservaActiva!.materia.matriculados} estudiantes — capacidad ${salon.capacidad}`
        : null;

      // Próximas reservas (7 días) para el timeline del dashboard
      const proximasReservas = salon.reservas
        .filter((r) => {
          const inicio = new Date(r.horaInicio);
          return inicio >= hoy && inicio < en7dias;
        })
        .map((r) => ({
          fecha: fmtFecha(r.horaInicio),
          hora: `${fmtHora(r.horaInicio)} – ${fmtHora(r.horaFin)}`,
          materia: r.materia.nombre,
          docente: r.docente.nombreCompleto,
          matriculados: r.materia.matriculados,
          estado: r.estado,
        }));

      return {
        id: salon.id,
        codigo: salon.codigo,
        nombre: salon.nombre,
        edificio: salon.edificio,
        capacidad: salon.capacidad,
        tieneProyector: salon.tieneProyector,
        tieneAC: salon.tieneAC,
        tieneTablero: salon.tieneTablero,
        estado,
        reservaActiva,
        proximaReserva,
        alerta,
        proximasReservas,
      };
    });
  }

  async alertas() {
    const ahora = ahoraColombia();

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
        salonNombre: r.salon.nombre,
        salonCodigo: r.salon.codigo,
        materiaNombre: r.materia.nombre,
        matriculados: r.materia.matriculados,
        capacidad: r.salon.capacidad,
        exceso: r.materia.matriculados - r.salon.capacidad,
        porcentaje: Math.round((r.materia.matriculados / r.salon.capacidad) * 100),
        docenteNombre: r.docente.nombreCompleto,
        libreA: r.horaFin,
      }));
  }

  // Estadísticas generales para un posible panel de resumen
  async stats() {
    const ahora = ahoraColombia();
    const [totalSalones, totalReservas, reservasActivas] = await Promise.all([
      this.prisma.salon.count(),
      this.prisma.reserva.count(),
      this.prisma.reserva.count({
        where: { horaInicio: { lte: ahora }, horaFin: { gte: ahora } },
      }),
    ]);
    return { totalSalones, totalReservas, reservasActivas };
  }
}