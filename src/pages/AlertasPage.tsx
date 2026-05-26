import { useEffect, useState } from "react";
import { salonesApi, type Alerta } from "../api/salones";

export default function AlertasPage() {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    salonesApi.alertas().then(setAlertas).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Panel de Alertas</h1>
        <p className="text-gray-500 text-sm">Salones con sobrecupo activo en este momento</p>
      </div>

      {loading && <p className="text-gray-500 text-sm">Verificando alertas...</p>}

      {!loading && alertas.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <p className="text-green-700 font-medium">✅ Sin alertas activas</p>
          <p className="text-green-600 text-sm mt-1">Todos los salones están dentro de su capacidad</p>
        </div>
      )}

      <div className="space-y-3">
        {alertas.map((a, i) => (
          <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-red-800">⚠️ SOBRECUPO — {a.salon}</p>
                <p className="text-sm text-red-700 mt-1">📚 {a.materia}</p>
                <p className="text-sm text-red-700">👨‍🏫 {a.docente}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-700">{a.matriculados}</p>
                <p className="text-xs text-red-500">de {a.capacidad} cap.</p>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-red-100 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (a.matriculados / a.capacidad) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-red-600 mt-1">
                {Math.round((a.matriculados / a.capacidad) * 100)}% de ocupación · Libre a las {new Date(a.libreA).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}