export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function http<T>(path: string, options?: RequestInit): Promise<T> {
  // Lee el token guardado después del login
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      // Si hay token lo envía automáticamente en todas las peticiones
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  // Si el token expiró o es inválido, cierra sesión automáticamente
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    throw new Error("Sesión expirada");
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `HTTP ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
