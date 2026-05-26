import { useEffect, useState } from "react";
import { materiasApi, type Materia } from "../api/materias";
import { programasApi, type Programa } from "../api/programas";

export default function MateriasPage() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ codigo: "", nombre: "", matriculados: 0, programaAcademicoId: 0 });

  const cargar = () => {
    setLoading(true);
    Promise.all([materiasApi.list(), programasApi.list()])
      .then(([m, p]) => { setMaterias(m); setProgramas(p); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    await materiasApi.create(form);
    setShowForm(false);
    setForm({ codigo: "", nombre: "", matriculados: 0, programaAcademicoId: 0 });
    cargar();
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Eliminar esta materia?")) {
      await materiasApi.remove(id);
      cargar();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Materias</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Nueva materia
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-700">Registrar materia</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Código (ej. CS101)" value={form.codigo}
              onChange={e => setForm({ ...form, codigo: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Nombre" value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Matriculados" type="number" value={form.matriculados}
              onChange={e => setForm({ ...form, matriculados: Number(e.target.value) })}
              className="border rounded-lg px-3 py-2 text-sm" />
            <select value={form.programaAcademicoId}
              onChange={e => setForm({ ...form, programaAcademicoId: Number(e.target.value) })}
              className="border rounded-lg px-3 py-2 text-sm">
              <option value={0}>Seleccionar programa</option>
              {programas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
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
              <th className="p-3">Matriculados</th>
              <th className="p-3">Programa</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materias.map((m) => (
              <tr key={m.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{m.codigo}</td>
                <td className="p-3">{m.nombre}</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                    {m.matriculados} estudiantes
                  </span>
                </td>
                <td className="p-3 text-gray-500">{m.programa?.nombre ?? "-"}</td>
                <td className="p-3">
                  <button onClick={() => eliminar(m.id)}
                    className="text-red-600 hover:underline text-xs">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && materias.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-gray-400">No hay materias registradas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}