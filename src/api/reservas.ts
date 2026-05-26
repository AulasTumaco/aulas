import { http } from "./http";

export type Reserva = {
  id: number;
  salonId: number;
  materiaId: number;
  docenteId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  estado: "LIBRE" | "OCUPADO" | "RESERVADO";
  salon?: any;
  materia?: any;
  docente?: any;
};

export const reservasApi = {
  list: () => http<Reserva[]>("/reservas"),
  create: (dto: Omit<Reserva, "id" | "salon" | "materia" | "docente">) =>
    http<Reserva>("/reservas", { method: "POST", body: JSON.stringify(dto) }),
  update: (id: number, dto: Partial<Reserva>) =>
    http<Reserva>(`/reservas/${id}`, { method: "PATCH", body: JSON.stringify(dto) }),
  remove: (id: number) =>
    http<void>(`/reservas/${id}`, { method: "DELETE" }),
  horario: (salonId: number) =>
    http<Reserva[]>(`/reservas/salon/${salonId}/horario`),
};