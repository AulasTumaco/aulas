import { http } from "./http";

export type Salon = {
  id: number;
  codigo: string;
  nombre: string;
  edificio: string;
  capacidad: number;
  tieneProyector: boolean;
  tieneAC: boolean;
  tieneTablero: boolean;
};

export type ReservaActiva = {
  id: number;
  estado: string;
  horaInicio: string;
  horaFin: string;
  materia: { nombre: string; matriculados: number };
  docente: { nombreCompleto: string };
};

export type ProximaReservaSlot = {
  fecha: string;
  hora: string;
  materia: string;
  docente: string;
  matriculados: number;
  estado: string;
};

export type SalonDashboard = Salon & {
  estado: "LIBRE" | "OCUPADO" | "RESERVADO";
  reservaActiva: ReservaActiva | null;
  proximaReserva: ReservaActiva | null;
  alerta: string | null;
  proximasReservas: ProximaReservaSlot[];
};

export type Alerta = {
  tipo: string;
  salonNombre: string;
  salonCodigo: string;
  materiaNombre: string;
  matriculados: number;
  capacidad: number;
  exceso: number;
  porcentaje: number;
  docenteNombre: string;
  libreA: string;
};

export const salonesApi = {
  list:      () => http<Salon[]>("/salones"),
  dashboard: () => http<SalonDashboard[]>("/salones/dashboard"),
  alertas:   () => http<Alerta[]>("/salones/alertas"),
  create:    (dto: Omit<Salon, "id">) =>
    http<Salon>("/salones", { method: "POST", body: JSON.stringify(dto) }),
  update:    (id: number, dto: Partial<Salon>) =>
    http<Salon>(`/salones/${id}`, { method: "PATCH", body: JSON.stringify(dto) }),
  remove:    (id: number) =>
    http<void>(`/salones/${id}`, { method: "DELETE" }),
};