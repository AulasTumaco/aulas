import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EstadoReserva } from '@prisma/client';

function ahoraColombia(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
}

@Injectable()
export class ReservasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    salonId: number;
    materiaId: number;
    docenteId: number;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado?: EstadoReserva;
  }) {
    const salon = await this.prisma.salon.findUnique({ where: { id: data.salonId } });
    if (!salon) throw new NotFoundException(`Salón ${data.salonId} no existe`);

    const materia = await this.prisma.materia.findUnique({ where: { id: data.materiaId } });
    if (!materia) throw new NotFoundException(`Materia ${data.materiaId} no existe`);

    const docente = await this.prisma.docente.findUnique({ where: { id: data.docenteId } });
    if (!docente) throw new NotFoundException(`Docente ${data.docenteId} no existe`);

    const nuevaInicio = new Date(data.horaInicio);
    const nuevaFin = new Date(data.horaFin);

    if (isNaN(nuevaInicio.getTime()) || isNaN(nuevaFin.getTime())) {
      throw new BadRequestException('Fechas inválidas. Usa formato ISO 8601.');
    }
    if (nuevaFin <= nuevaInicio) {
      throw new BadRequestException('La hora de fin debe ser posterior a la hora de inicio.');
    }

    // Bloquear sobrecupo
    if (materia.matriculados > salon.capacidad) {
      throw new BadRequestException(
        `SOBRECUPO: "${materia.nombre}" tiene ${materia.matriculados} matriculados ` +
        `pero "${salon.nombre}" solo tiene capacidad para ${salon.capacidad}. ` +
        `Exceso: ${materia.matriculados - salon.capacidad} estudiantes.`,
      );
    }

    // Detectar conflicto de horario — solapamiento real
    const conflicto = await this.prisma.reserva.findFirst({
      where: {
        salonId: data.salonId,
        AND: [
          { horaInicio: { lt: nuevaFin } },
          { horaFin: { gt: nuevaInicio } },
        ],
      },
      include: { materia: true },
    });

    if (conflicto) {
      const ini = new Date(conflicto.horaInicio).toLocaleTimeString('es-CO', {
        hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota',
      });
      const fin = new Date(conflicto.horaFin).toLocaleTimeString('es-CO', {
        hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota',
      });
      throw new BadRequestException(
        `Conflicto de horario: el salón ya tiene "${conflicto.materia.nombre}" de ${ini} a ${fin}.`,
      );
    }

    return this.prisma.reserva.create({
      data: {
        salonId: data.salonId,
        materiaId: data.materiaId,
        docenteId: data.docenteId,
        fecha: new Date(data.fecha),
        horaInicio: nuevaInicio,
        horaFin: nuevaFin,
        estado: data.estado ?? 'RESERVADO',
      },
      include: { salon: true, materia: true, docente: true },
    });
  }

  async findAll() {
    return this.prisma.reserva.findMany({
      include: { salon: true, materia: true, docente: true },
      orderBy: [{ salon: { nombre: 'asc' } }, { horaInicio: 'asc' }],
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

  async update(id: number, data: Partial<{
    salonId: number; materiaId: number; docenteId: number;
    fecha: string; horaInicio: string; horaFin: string; estado: EstadoReserva;
  }>) {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (data.fecha) updateData.fecha = new Date(data.fecha);
    if (data.horaInicio) updateData.horaInicio = new Date(data.horaInicio);
    if (data.horaFin) updateData.horaFin = new Date(data.horaFin);
    return this.prisma.reserva.update({ where: { id }, data: updateData });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.reserva.delete({ where: { id } });
  }

  async horarioSemanal(salonId: number) {
    const ahora = ahoraColombia();
    const inicioSemana = new Date(ahora);
    inicioSemana.setHours(0, 0, 0, 0);
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(finSemana.getDate() + 7);

    return this.prisma.reserva.findMany({
      where: {
        salonId,
        horaInicio: { gte: inicioSemana, lt: finSemana },
      },
      include: { materia: true, docente: true, salon: true },
      orderBy: { horaInicio: 'asc' },
    });
  }

  // Cancelar reservas vencidas automáticamente
  async limpiarVencidas() {
    const ahora = ahoraColombia();
    const resultado = await this.prisma.reserva.deleteMany({
      where: { horaFin: { lt: ahora } },
    });
    return { eliminadas: resultado.count };
  }
}