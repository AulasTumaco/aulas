import { useEffect, useRef, useState } from "react";
import { salonesApi, type ProximaReservaSlot, type SalonDashboard } from "../api/salones";

// ─── Utilidades ─────────────────────────────────────────────────────────────
function fmtHora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit", minute: "2-digit", timeZone: "America/Bogota",
  });
}

// ─── Fachada SVG tipo edificio universitario ────────────────────────────────
function AulaFacade({ estado, capacidad }: { estado: string; capacidad: number }) {
  const C = {
    OCUPADO:   { wall: "#dc2626", win: "#fca5a5", roof: "#991b1b", door: "#7f1d1d", grass: "#16a34a" },
    RESERVADO: { wall: "#d97706", win: "#fde68a", roof: "#92400e", door: "#78350f", grass: "#15803d" },
    LIBRE:     { wall: "#16a34a", win: "#bbf7d0", roof: "#14532d", door: "#052e16", grass: "#15803d" },
  }[estado] ?? { wall: "#6b7280", win: "#d1d5db", roof: "#374151", door: "#1f2937", grass: "#4b5563" };

  const floors = capacidad > 40 ? 3 : capacidad > 20 ? 2 : 1;
  const H = 82 + floors * 18;
  const roofY = 14 + floors * 18;

  return (
    <svg viewBox={`0 0 240 ${H}`} width="100%" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <rect width={240} height={H} fill="#f8fafc" />
      <polygon points={`10,${roofY} 120,4 230,${roofY}`} fill={C.roof} />
      <rect x={18} y={roofY} width={204} height={50} rx={3} fill={C.wall} />
      {Array.from({ length: floors }, (_, f) =>
        Array.from({ length: 4 }, (_, w) => (
          <rect key={`${f}-${w}`} x={28 + w * 50} y={20 + f * 18} width={18} height={12} rx={2} fill={C.win} opacity={0.9} />
        ))
      )}
      <rect x={101} y={roofY + 28} width={38} height={22} rx={3} fill={C.door} />
      <circle cx={120} cy={roofY + 39} r={2} fill={C.win} opacity={0.8} />
      <rect x={0} y={H - 8} width={240} height={8} fill={C.grass} opacity={0.2} />
    </svg>
  );
}

// ─── Timeline de próximas reservas ──────────────────────────────────────────
function ProximasReservas({ slots }: { slots: ProximaReservaSlot[] }) {
  if (!slots || slots.length === 0) return null;

  const dot: Record<string, string> = {
    OCUPADO: "bg-red-500", RESERVADO: "bg-amber-400", LIBRE: "bg-emerald-500",
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-2">
        Próximas reservas
      </p>
      <div className="space-y-2">
        {slots.map((s, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${dot[s.estado] ?? "bg-gray-300"}`} />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between items-baseline gap-1">
                <span className="text-xs font-medium text-gray-700 truncate">{s.materia}</span>
                <span className="text-[11px] text-gray-400 flex-shrink-0">{s.fecha}</span>
              </div>
              <p className="text-[11px] text-gray-400">{s.hora} · {s.docente}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tarjeta de salón ────────────────────────────────────────────────────────
function TarjetaSalon({ salon }: { salon: SalonDashboard }) {
  const pct = salon.reservaActiva
    ? Math.round((salon.reservaActiva.materia.matriculados / salon.capacidad) * 100)
    : 0;
  const sobrecupo = salon.reservaActiva && salon.reservaActiva.materia.matriculados > salon.capacidad;
  const barColor = pct > 100 ? "bg-red-500" : pct > 80 ? "bg-amber-400" : "bg-emerald-500";

  const badge = {
    OCUPADO:   "bg-red-50 text-red-700 border-red-200",
    RESERVADO: "bg-amber-50 text-amber-700 border-amber-200",
    LIBRE:     "bg-green-50 text-green-700 border-green-200",
  }[salon.estado] ?? "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <div className="rounded-xl overflow-hidden border border-gray-100 bg-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
      <AulaFacade estado={salon.estado} capacidad={salon.capacidad} />

      <div className="px-3.5 pt-3 pb-4">
        {/* Nombre y badge */}
        <div className="flex justify-between items-start mb-2 gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate">{salon.nombre}</p>
            <p className="text-xs text-gray-400">{salon.codigo} · {salon.edificio}</p>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${badge}`}>
            {salon.estado}
          </span>
        </div>

        {/* Chips equipamiento */}
        <div className="flex flex-wrap gap-1 mb-3">
          <span className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            🪑 {salon.capacidad}
          </span>
          {salon.tieneProyector && (
            <span className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              📽 Proyector
            </span>
          )}
          {salon.tieneAC && (
            <span className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              ❄️ AC
            </span>
          )}
          {salon.tieneTablero && (
            <span className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              📋 Tablero
            </span>
          )}
        </div>

        {/* Estado actual */}
        {salon.reservaActiva && (
          <div className="rounded-lg bg-red-50 border border-red-100 p-2.5 space-y-1.5">
            <p className="text-[10px] font-semibold text-red-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              En curso · hasta {fmtHora(salon.reservaActiva.horaFin)}
            </p>
            <p className="text-xs font-medium text-gray-800">📚 {salon.reservaActiva.materia.nombre}</p>
            <p className="text-xs text-gray-500">👨‍🏫 {salon.reservaActiva.docente.nombreCompleto}</p>
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-gray-400">Estudiantes</span>
                <span className={`font-medium ${pct > 100 ? "text-red-600" : "text-gray-600"}`}>
                  {salon.reservaActiva.materia.matriculados}/{salon.capacidad}
                </span>
              </div>
              <div className="h-1.5 bg-red-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor}`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
            {sobrecupo && (
              <p className="text-[11px] text-red-700 font-semibold bg-red-100 rounded px-2 py-1">
                🚨 Sobrecupo: {salon.reservaActiva.materia.matriculados - salon.capacidad} estudiantes de más
              </p>
            )}
          </div>
        )}

        {!salon.reservaActiva && salon.estado === "RESERVADO" && salon.proximaReserva && (
          <div className="rounded-lg bg-amber-50 border border-amber-100 p-2.5">
            <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-1">
              🕐 Próxima · {fmtHora(salon.proximaReserva.horaInicio)}
            </p>
            <p className="text-xs font-medium text-gray-800">📚 {salon.proximaReserva.materia.nombre}</p>
            <p className="text-xs text-gray-500">👨‍🏫 {salon.proximaReserva.docente.nombreCompleto}</p>
          </div>
        )}

        {salon.estado === "LIBRE" && (
          <div className="rounded-lg bg-green-50 border border-green-100 p-2.5">
            <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wider mb-0.5">
              ✅ Disponible ahora
            </p>
            <p className="text-xs text-gray-500">
              {salon.proximaReserva
                ? `Próxima clase a las ${fmtHora(salon.proximaReserva.horaInicio)}`
                : "Sin clases programadas"}
            </p>
          </div>
        )}

        {/* Timeline 7 días */}
        <ProximasReservas slots={salon.proximasReservas} />
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [salones, setSalones] = useState<SalonDashboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<"TODOS" | "LIBRE" | "OCUPADO" | "RESERVADO">("TODOS");
  const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cargar = async () => {
    try {
      const data = await salonesApi.dashboard();
      setSalones(data);
      setUltimaActualizacion(new Date());
      setError(null);
    } catch (e: any) {
      setError(e.message ?? "Error al cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    intervalRef.current = setInterval(cargar, 30_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const libres    = salones.filter((s) => s.estado === "LIBRE").length;
  const ocupados  = salones.filter((s) => s.estado === "OCUPADO").length;
  const reservados= salones.filter((s) => s.estado === "RESERVADO").length;
  const alertas   = salones.filter((s) => s.alerta).length;
  const filtrados = filtro === "TODOS" ? salones : salones.filter((s) => s.estado === filtro);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Dashboard en tiempo real</h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
            UniNariño sede Tumaco
            {ultimaActualizacion && (
              <span>· Actualizado {ultimaActualizacion.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}</span>
            )}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); cargar(); }}
          className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
        >
          🔄 Actualizar
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Libres",     num: libres,    desc: "disponibles ahora",  color: "bg-green-600",  f: "LIBRE" },
          { label: "Ocupados",   num: ocupados,  desc: "en uso ahora",       color: "bg-red-600",    f: "OCUPADO" },
          { label: "Reservados", num: reservados,desc: "próximas clases",    color: "bg-amber-500",  f: "RESERVADO" },
          { label: "Alertas",    num: alertas,   desc: alertas > 0 ? "sobrecupos activos" : "sin problemas", color: alertas > 0 ? "bg-rose-700" : "bg-gray-500", f: "TODOS" },
        ].map(({ label, num, desc, color, f }) => (
          <button
            key={f}
            onClick={() => setFiltro(f as typeof filtro)}
            className={`text-left ${color} rounded-xl p-4 hover:opacity-90 transition-opacity`}
          >
            <p className="text-white/70 text-[10px] uppercase font-semibold tracking-wider">{label}</p>
            <p className="text-white text-4xl font-semibold mt-1 leading-none">{num}</p>
            <p className="text-white/60 text-[11px] mt-1">{desc}</p>
          </button>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {(["TODOS", "LIBRE", "OCUPADO", "RESERVADO"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filtro === f
                ? "bg-blue-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f === "TODOS" ? `Todos (${salones.length})` :
             f === "LIBRE" ? `Libres (${libres})` :
             f === "OCUPADO" ? `Ocupados (${ocupados})` :
             `Reservados (${reservados})`}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-24 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtrados.map((s) => <TarjetaSalon key={s.id} salon={s} />)}
        </div>
      )}

      {!loading && filtrados.length === 0 && (
        <div className="text-center py-14 text-gray-400">
          <p className="text-4xl mb-2">🏫</p>
          <p className="font-medium">No hay salones en este estado</p>
        </div>
      )}
    </div>
  );
}