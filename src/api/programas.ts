import { http } from "./http";

export type Programa = {
  id: number;
  nombre: string;
};

export const programasApi = {
  list: () => http<Programa[]>("/programas"),
  create: (nombre: string) =>
    http<Programa>("/programas", { method: "POST", body: JSON.stringify({ nombre }) }),
};