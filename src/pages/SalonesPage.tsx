import { useEffect, useState } from "react";
import { salonesApi, type Salon } from "../api/salones";

export default function SalonesPage() {
  const [salones, setSalones] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    codigo: "", nombre: "", edificio: "", capacidad: 0,
    tieneProyector: false, tieneAC: false, tieneTablero: true,
  });
  const [showForm, setShowForm] = useState(false);

  const cargar = () => {
    setLoading(true);
    salonesApi.list().then(setSalones).finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    await salonesApi.create(form);
    setShowForm(false);
    setForm({ codigo: "", nombre: "", edificio: "", capacidad: 0,
      tieneProyector: false, tieneAC: false, tieneTablero: true });
    cargar();
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Eliminar este salón?")) {
      await salonesApi.remove(id);
      cargar();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Salones</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          + Nuevo salón
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-700">Registrar salón</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Código (ej. A-101)" value={form.codigo}
              onChange={e => setForm({ ...form, codigo: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Nombre" value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Edificio" value={form.edificio}
              onChange={e => setForm({ ...form, edificio: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Capacidad" type="number" value={form.capacidad}
              onChange={e => setForm({ ...form, capacidad: Number(e.target.value) })}
              className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.tieneProyector}
                onChange={e => setForm({ ...form, tieneProyector: e.target.checked })} />
              Proyector
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.tieneAC}
                onChange={e => setForm({ ...form, tieneAC: e.target.checked })} />
              Aire acondicionado
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.tieneTablero}
                onChange={e => setForm({ ...form, tieneTablero: e.target.checked })} />
              Tablero
            </label>
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
              <th className="p-3">Código</th>
              <th className="p-3">Nombre</th>
              <th className="p-3">Edificio</th>
              <th className="p-3">Capacidad</th>
              <th className="p-3">Equipamiento</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {salones.map((s) => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{s.codigo}</td>
                <td className="p-3">{s.nombre}</td>
                <td className="p-3">{s.edificio}</td>
                <td className="p-3">{s.capacidad} personas</td>
                <td className="p-3 space-x-1">
                  {s.tieneProyector && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Proyector</span>}
                  {s.tieneAC && <span className="bg-cyan-100 text-cyan-700 text-xs px-2 py-0.5 rounded-full">AC</span>}
                  {s.tieneTablero && <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">Tablero</span>}
                </td>
                <td className="p-3">
                  <button onClick={() => eliminar(s.id)}
                    className="text-red-600 hover:underline text-xs">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && salones.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-gray-400">No hay salones registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}