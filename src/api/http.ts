const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  if (!res.ok) {
    let mensaje = `Error ${res.status}`;
    try {
      const body = await res.json();
      mensaje = body?.message ?? mensaje;
    } catch { /* sin cuerpo JSON */ }
    throw new Error(mensaje);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}