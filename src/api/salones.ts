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

export type SalonDashboard = {
  id: number;
  codigo: string;
  nombre: string;
  edificio: string;
  capacidad: number;
  estado: "LIBRE" | "OCUPADO" | "RESERVADO";
  reservaActiva: any | null;
  alerta: string | null;
};

export type Alerta = {
  tipo: string;
  salon: string;
  materia: string;
  matriculados: number;
  capacidad: number;
  docente: string;
  libreA: string;
};

export const salonesApi = {
  list: () => http<Salon[]>("/salones"),
  dashboard: () => http<SalonDashboard[]>("/salones/dashboard"),
  alertas: () => http<Alerta[]>("/salones/alertas"),
  create: (dto: Omit<Salon, "id">) =>
    http<Salon>("/salones", { method: "POST", body: JSON.stringify(dto) }),
  update: (id: number, dto: Partial<Salon>) =>
    http<Salon>(`/salones/${id}`, { method: "PATCH", body: JSON.stringify(dto) }),
  remove: (id: number) =>
    http<void>(`/salones/${id}`, { method: "DELETE" }),
};