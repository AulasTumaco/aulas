import { useEffect, useState } from "react";
import { reservasApi, type Reserva } from "../api/reservas";
import { salonesApi, type Salon } from "../api/salones";
import { materiasApi, type Materia } from "../api/materias";
import { docentesApi, type Docente } from "../api/docentes";

export default function ReservasPage() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [salones, setSalones] = useState<Salon[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    salonId: 0, materiaId: 0, docenteId: 0,
    fecha: "", horaInicio: "", horaFin: "", estado: "RESERVADO" as "RESERVADO" | "OCUPADO" | "LIBRE",
  });

  const cargar = () => {
    setLoading(true);
    Promise.all([reservasApi.list(), salonesApi.list(), materiasApi.list(), docentesApi.list()])
      .then(([r, s, m, d]) => { setReservas(r); setSalones(s); setMaterias(m); setDocentes(d); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    await reservasApi.create({
      ...form,
      fecha: new Date(form.fecha).toISOString(),
      horaInicio: new Date(form.horaInicio).toISOString(),
      horaFin: new Date(form.horaFin).toISOString(),
    });
    setShowForm(false);
    cargar();
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Eliminar esta reserva?")) {
      await reservasApi.remove(id);
      cargar();
    }
  };

  const colorEstado = (estado: string) => {
    if (estado === "LIBRE") return "bg-green-100 text-green-700";
    if (estado === "OCUPADO") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reservas</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Nueva reserva
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-700">Registrar reserva</h2>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.salonId}
              onChange={e => setForm({ ...form, salonId: Number(e.target.value) })}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value={0}>Seleccionar salón</option>
              {salones.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
            </select>
            <select value={form.materiaId}
              onChange={e => setForm({ ...form, materiaId: Number(e.target.value) })}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value={0}>Seleccionar materia</option>
              {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
            <select value={form.docenteId}
              onChange={e => setForm({ ...form, docenteId: Number(e.target.value) })}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value={0}>Seleccionar docente</option>
              {docentes.map(d => <option key={d.id} value={d.id}>{d.nombreCompleto}</option>)}
            </select>
            <select value={form.estado}
              onChange={e => setForm({ ...form, estado: e.target.value as any })}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value="RESERVADO">RESERVADO</option>
              <option value="OCUPADO">OCUPADO</option>
              <option value="LIBRE">LIBRE</option>
            </select>
            <div className="col-span-2 grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Fecha</label>
                <input type="date" value={form.fecha}
                  onChange={e => setForm({ ...form, fecha: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm w-full" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Hora inicio</label>
                <input type="datetime-local" value={form.horaInicio}
                  onChange={e => setForm({ ...form, horaInicio: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm w-full" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Hora fin</label>
                <input type="datetime-local" value={form.horaFin}
                  onChange={e => setForm({ ...form, horaFin: e.target.value })}
                  className="border rounded-lg px-3 py-2 text-sm w-full" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={guardar}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
              Guardar
            </button>
            <button onClick={() => setShowForm(false)}
              className="border px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {loading && <p className="text-gray-500 text-sm">Cargando...</p>}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-3">Salón</th>
              <th className="p-3">Materia</th>
              <th className="p-3">Docente</th>
              <th className="p-3">Inicio</th>
              <th className="p-3">Fin</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{r.salon?.nombre ?? r.salonId}</td>
                <td className="p-3">{r.materia?.nombre ?? r.materiaId}</td>
                <td className="p-3">{r.docente?.nombreCompleto ?? r.docenteId}</td>
                <td className="p-3 text-xs">{new Date(r.horaInicio).toLocaleString("es-CO")}</td>
                <td className="p-3 text-xs">{new Date(r.horaFin).toLocaleString("es-CO")}</td>
                <td className="p-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colorEstado(r.estado)}`}>
                    {r.estado}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => eliminar(r.id)}
                    className="text-red-600 hover:underline text-xs">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && reservas.length === 0 && (
              <tr><td colSpan={7} className="p-6 text-center text-gray-400">No hay reservas registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}