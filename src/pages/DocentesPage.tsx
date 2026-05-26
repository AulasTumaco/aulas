import { useEffect, useState } from "react";
import { docentesApi, type Docente } from "../api/docentes";
import { programasApi, type Programa } from "../api/programas";

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [programas, setProgramas] = useState<Programa[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombreCompleto: "", correo: "", programaAcademicoId: 0 });

  const cargar = () => {
    setLoading(true);
    Promise.all([docentesApi.list(), programasApi.list()])
      .then(([d, p]) => { setDocentes(d); setProgramas(p); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { cargar(); }, []);

  const guardar = async () => {
    await docentesApi.create(form);
    setShowForm(false);
    setForm({ nombreCompleto: "", correo: "", programaAcademicoId: 0 });
    cargar();
  };

  const eliminar = async (id: number) => {
    if (confirm("¿Eliminar este docente?")) {
      await docentesApi.remove(id);
      cargar();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Docentes</h1>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
          + Nuevo docente
        </button>
      </div>

      {showForm && (
        <div className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-700">Registrar docente</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Nombre completo" value={form.nombreCompleto}
              onChange={e => setForm({ ...form, nombreCompleto: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm col-span-2" />
            <input placeholder="Correo" value={form.correo}
              onChange={e => setForm({ ...form, correo: e.target.value })}
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
              <th className="p-3">Nombre</th>
              <th className="p-3">Correo</th>
              <th className="p-3">Programa</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {docentes.map((d) => (
              <tr key={d.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium">{d.nombreCompleto}</td>
                <td className="p-3 text-gray-500">{d.correo}</td>
                <td className="p-3 text-gray-500">{d.programa?.nombre ?? "-"}</td>
                <td className="p-3">
                  <button onClick={() => eliminar(d.id)}
                    className="text-red-600 hover:underline text-xs">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {!loading && docentes.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-gray-400">No hay docentes registrados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}