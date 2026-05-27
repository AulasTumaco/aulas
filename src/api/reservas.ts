import { http } from "./http";

export type Reserva = {
  id: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: "RESERVADO" | "OCUPADO" | "LIBRE";
  salon?: { id: number; nombre: string; codigo: string; capacidad: number };
  materia?: { id: number; nombre: string; matriculados: number };
  docente?: { id: number; nombreCompleto: string };
};

export const reservasApi = {
  list:   () => http<Reserva[]>("/reservas"),
  create: (data: {
    salonId: number; materiaId: number; docenteId: number;
    fecha: string; horaInicio: string; horaFin: string;
    estado?: string;
  }) => http<Reserva>("/reservas", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Reserva>) =>
    http<Reserva>(`/reservas/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (id: number) =>
    http<void>(`/reservas/${id}`, { method: "DELETE" }),
  limpiarVencidas: () => http<{ eliminadas: number }>("/reservas/limpiar-vencidas"),
};