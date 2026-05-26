import { http } from "./http";

export type Docente = {
  id: number;
  nombreCompleto: string;
  correo: string;
  programaAcademicoId: number;
  programa?: { nombre: string };
};

export const docentesApi = {
  list: () => http<Docente[]>("/docentes"),
  create: (dto: Omit<Docente, "id" | "programa">) =>
    http<Docente>("/docentes", { method: "POST", body: JSON.stringify(dto) }),
  remove: (id: number) =>
    http<void>(`/docentes/${id}`, { method: "DELETE" }),
};