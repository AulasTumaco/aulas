import { http } from "./http";

export type Materia = {
  id: number;
  codigo: string;
  nombre: string;
  matriculados: number;
  programaAcademicoId: number;
  programa?: { nombre: string };
};

export const materiasApi = {
  list: () => http<Materia[]>("/materias"),
  create: (dto: Omit<Materia, "id" | "programa">) =>
    http<Materia>("/materias", { method: "POST", body: JSON.stringify(dto) }),
  update: (id: number, dto: Partial<Materia>) =>
    http<Materia>(`/materias/${id}`, { method: "PATCH", body: JSON.stringify(dto) }),
  remove: (id: number) =>
    http<void>(`/materias/${id}`, { method: "DELETE" }),
};