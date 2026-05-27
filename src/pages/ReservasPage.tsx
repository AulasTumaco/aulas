import { useEffect, useState } from "react";
import { reservasApi, type Reserva } from "../api/reservas";
import { salonesApi, type Salon } from "../api/salones";
import { materiasApi, type Materia } from "../api/materias";
import { docentesApi, type Docente } from "../api/docentes";

function fmtHora(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", {
    hour: "2-digit", minute: "2-digit", timeZone: "America/Bogota",
  });
}
function fmtFecha(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "2-digit", month: "short", timeZone: "America/Bogota",
  });
}
function estaActiva(r: Reserva) {
  const ahora = Date.now();
  return new Date(r.horaInicio).getTime() <= ahora && ahora <= new Date(r.horaFin).getTime();
}
function esFutura(r: Reserva) {
  return new Date(r.horaInicio).getTime() > Date.now();
}

// ─── Tarjeta reserva individual ──────────────────────────────────────────────
function TarjetaReserva({ r, onEliminar }: { r: Reserva; onEliminar: () => void }) {
  const activa = estaActiva(r);
  const futura = esFutura(r);

  const bg    = activa ? "bg-red-50 border-red-100"    : futura ? "bg-amber-50 border-amber-100"    : "bg-gray-50 border-gray-100";
  const dotBg = activa ? "bg-red-500"                  : futura ? "bg-amber-400"                    : "bg-gray-300";
  const tag   = activa ? "text-red-600"                : futura ? "text-amber-600"                  : "text-gray-400";
  const label = activa ? "EN CURSO"                    : r.estado;

  return (
    <div className={`relative mt-2 rounded-lg border p-3.5 ${bg}`}>
      <div className="flex justify-between items-start gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dotBg}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${tag}`}>{label}</span>
              {activa && <span className="text-[10px] text-red-400 animate-pulse">● Live</span>}
            </div>
            <p className="text-sm font-medium text-gray-800 truncate">📚 {r.materia?.nombre ?? "—"}</p>
            <p className="text-xs text-gray-500 mt-0.5">👨‍🏫 {r.docente?.nombreCompleto ?? "—"}</p>
            <p className="text-xs text-gray-400 mt-0.5">👥 {r.materia?.matriculados ?? "?"} estudiantes</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">{fmtFecha(r.horaInicio)}</p>
          <p className="text-sm font-semibold text-gray-700 mt-0.5">{fmtHora(r.horaInicio)}</p>
          <p className="text-xs text-gray-400">hasta {fmtHora(r.horaFin)}</p>
        </div>
      </div>
      <button
        onClick={onEliminar}
        className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center rounded text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors text-xs"
        title="Eliminar reserva"
      >✕</button>
    </div>
  );
}

// ─── Bloque de un salón ──────────────────────────────────────────────────────
function BloqueSalon({
  salon, reservas, onEliminar,
}: {
  salon: Salon; reservas: Reserva[]; onEliminar: (id: number) => void;
}) {
  const [expandido, setExpandido] = useState(true);
  const activa    = reservas.some(estaActiva);
  const hayFuturas= reservas.some(esFutura);

  const accentBorder = activa ? "border-l-red-400"    : hayFuturas ? "border-l-amber-400"    : "border-l-emerald-400";
  const dotColor     = activa ? "bg-red-500 animate-pulse" : hayFuturas ? "bg-amber-400"     : "bg-emerald-500";

  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${accentBorder} shadow-sm overflow-hidden`}>
      <button
        onClick={() => setExpandido(!expandido)}
        className="w-full px-5 py-3.5 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${dotColor}`} />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{salon.nombre}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {salon.codigo} · {salon.edificio} · cap. {salon.capacidad}
              {salon.tieneProyector ? " · 📽" : ""}
              {salon.tieneAC ? " · ❄️" : ""}
              {salon.tieneTablero ? " · 📋" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {reservas.length} reserva{reservas.length !== 1 ? "s" : ""}
          </span>
          <span className="text-gray-300 text-xs">{expandido ? "▲" : "▼"}</span>
        </div>
      </button>

      {expandido && (
        <div className="px-5 pb-4 border-t border-gray-50">
          {reservas.length === 0 ? (
            <p className="text-center py-5 text-sm text-gray-400">Sin reservas</p>
          ) : (
            reservas.map((r) => (
              <TarjetaReserva key={r.id} r={r} onEliminar={() => onEliminar(r.id)} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Formulario nueva reserva ────────────────────────────────────────────────
function FormularioReserva({
  salones, materias, docentes, onGuardar, onCancelar,
}: {
  salones: Salon[]; materias: Materia[]; docentes: Docente[];
  onGuardar: (f: any) => Promise<void>; onCancelar: () => void;
}) {
  const [form, setForm] = useState({
    salonId: 0, materiaId: 0, docenteId: 0,
    horaInicio: "", horaFin: "", estado: "RESERVADO" as "RESERVADO" | "OCUPADO",
  });
  const [error, setError]       = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  const salonSel   = salones.find((s) => s.id === form.salonId);
  const materiaSel = materias.find((m) => m.id === form.materiaId);
  const sobrecupo  = salonSel && materiaSel && materiaSel.matriculados > salonSel.capacidad
    ? `"${materiaSel.nombre}" tiene ${materiaSel.matriculados} estudiantes pero "${salonSel.nombre}" tiene capacidad para ${salonSel.capacidad}.`
    : null;

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const guardar = async () => {
    setError(null);
    if (!form.salonId || !form.materiaId || !form.docenteId || !form.horaInicio || !form.horaFin) {
      setError("Completa todos los campos antes de guardar.");
      return;
    }
    if (sobrecupo) { setError(`Sobrecupo: ${sobrecupo}`); return; }
    setGuardando(true);
    try { await onGuardar(form); }
    catch (e: any) { setError(e.message ?? "Error al guardar"); }
    finally { setGuardando(false); }
  };

  const inputCls = "border border-gray-200 rounded-lg px-3 py-2.5 text-sm w-full focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white";

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
      <h2 className="font-semibold text-gray-800 flex items-center gap-2">
        🏫 Nueva reserva
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm text-red-700">
          🚨 {error}
        </div>
      )}
      {sobrecupo && !error && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5 text-sm text-orange-700">
          ⚠️ Sobrecupo detectado: {sobrecupo}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Salón</label>
          <select value={form.salonId} onChange={(e) => set("salonId", +e.target.value)} className={inputCls}>
            <option value={0}>Seleccionar salón</option>
            {salones.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre} ({s.codigo}) — cap. {s.capacidad}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Materia</label>
          <select value={form.materiaId} onChange={(e) => set("materiaId", +e.target.value)} className={inputCls}>
            <option value={0}>Seleccionar materia</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>{m.nombre} — {m.matriculados} estudiantes</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Docente</label>
          <select value={form.docenteId} onChange={(e) => set("docenteId", +e.target.value)} className={inputCls}>
            <option value={0}>Seleccionar docente</option>
            {docentes.map((d) => <option key={d.id} value={d.id}>{d.nombreCompleto}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Estado inicial</label>
          <select value={form.estado} onChange={(e) => set("estado", e.target.value)} className={inputCls}>
            <option value="RESERVADO">RESERVADO</option>
            <option value="OCUPADO">OCUPADO</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Hora inicio</label>
          <input type="datetime-local" value={form.horaInicio}
            onChange={(e) => set("horaInicio", e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Hora fin</label>
          <input type="datetime-local" value={form.horaFin}
            onChange={(e) => set("horaFin", e.target.value)} className={inputCls} />
        </div>
      </div>

      {/* Preview de ocupación */}
      {salonSel && materiaSel && (
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600">
          <span className="font-medium">Capacidad del salón:</span> {materiaSel.matriculados}/{salonSel.capacidad} estudiantes
          {" "}({Math.round(materiaSel.matriculados / salonSel.capacidad * 100)}%)
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={guardar}
          disabled={!!sobrecupo || guardando}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {guardando ? "Guardando…" : "Guardar reserva"}
        </button>
        <button
          onClick={onCancelar}
          className="border border-gray-200 px-5 py-2.5 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────
export default function ReservasPage() {
  const [reservas, setReservas]   = useState<Reserva[]>([]);
  const [salones, setSalones]     = useState<Salon[]>([]);
  const [materias, setMaterias]   = useState<Materia[]>([]);
  const [docentes, setDocentes]   = useState<Docente[]>([]);
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const cargar = () => {
    setLoading(true);
    Promise.all([reservasApi.list(), salonesApi.list(), materiasApi.list(), docentesApi.list()])
      .then(([r, s, m, d]) => { setReservas(r); setSalones(s); setMaterias(m); setDocentes(d); })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta reserva? Esta acción no se puede deshacer.")) return;
    try {
      await reservasApi.remove(id);
      cargar();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const guardar = async (form: any) => {
    await reservasApi.create({
      salonId:    form.salonId,
      materiaId:  form.materiaId,
      docenteId:  form.docenteId,
      fecha:      new Date(form.horaInicio).toISOString(),
      horaInicio: new Date(form.horaInicio).toISOString(),
      horaFin:    new Date(form.horaFin).toISOString(),
      estado:     form.estado,
    });
    setShowForm(false);
    cargar();
  };

  // Agrupar por salón, ordenar reservas por horaInicio
  const grupos = salones
    .map((salon) => ({
      salon,
      reservas: reservas
        .filter((r) => r.salon?.id === salon.id)
        .sort((a, b) => new Date(a.horaInicio).getTime() - new Date(b.horaInicio).getTime()),
    }))
    .filter(({ reservas }) => reservas.length > 0);

  const salonesLibres = salones.filter((s) => !grupos.find((g) => g.salon.id === s.id));
  const activas = reservas.filter(estaActiva).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Reservas de Salones</h1>
          <p className="text-sm text-gray-400 mt-1">
            UniNariño sede Tumaco · {reservas.length} reservas · {grupos.length} salones con reservas
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(null); }}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          + Nueva reserva
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <p className="text-3xl font-semibold text-gray-800">{reservas.length}</p>
          <p className="text-xs text-gray-400 mt-1">Total reservas</p>
        </div>
        <div className="bg-white border border-red-100 rounded-xl p-4 text-center shadow-sm">
          <p className="text-3xl font-semibold text-red-600">{activas}</p>
          <p className="text-xs text-gray-400 mt-1">En curso ahora</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm">
          <p className="text-3xl font-semibold text-gray-800">{grupos.length}</p>
          <p className="text-xs text-gray-400 mt-1">Salones con reservas</p>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <FormularioReserva
          salones={salones} materias={materias} docentes={docentes}
          onGuardar={guardar} onCancelar={() => { setShowForm(false); setError(null); }}
        />
      )}

      {loading && <p className="text-sm text-gray-400 py-4">Cargando reservas…</p>}

      {/* Bloques por salón */}
      <div className="space-y-3">
        {grupos.map(({ salon, reservas: resv }) => (
          <BloqueSalon key={salon.id} salon={salon} reservas={resv} onEliminar={eliminar} />
        ))}
      </div>

      {/* Salones sin reservas */}
      {salonesLibres.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Salones sin reservas
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {salonesLibres.map((s) => (
              <div key={s.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                <div className="w-9 h-11 bg-green-50 border-2 border-green-200 rounded flex items-end justify-center pb-1 flex-shrink-0">
                  <div className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-700 truncate">{s.nombre}</p>
                  <p className="text-xs text-gray-400">{s.codigo}</p>
                  <span className="text-[11px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full border border-green-100">
                    ✅ Libre
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && reservas.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🏫</p>
          <p className="font-medium text-gray-500">No hay reservas registradas</p>
          <p className="text-sm mt-1">Crea la primera con el botón de arriba</p>
        </div>
      )}
    </div>
  );
}