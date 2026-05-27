import { useEffect, useState } from "react";
import { salonesApi, type Alerta } from "../api/salones";

export default function AlertasPage() {
  const [alertas, setAlertas]   = useState<Alerta[]>([]);
  const [loading, setLoading]   = useState(false);
  const [ultima, setUltima]     = useState<Date | null>(null);

  const cargar = () => {
    setLoading(true);
    salonesApi.alertas()
      .then((data) => { setAlertas(data); setUltima(new Date()); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    cargar();
    const iv = setInterval(cargar, 30_000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Panel de Alertas</h1>
          <p className="text-sm text-gray-400 mt-1">
            {ultima
              ? `Última verificación: ${ultima.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}`
              : "Verificando…"}
          </p>
        </div>
        <button onClick={cargar}
          className="text-sm bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
          🔄 Actualizar
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Verificando alertas…</p>}

      {!loading && alertas.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
          <p className="text-5xl mb-3">✅</p>
          <p className="text-green-700 font-semibold text-lg">Sin alertas activas</p>
          <p className="text-green-600 text-sm mt-1">
            Todos los salones están dentro de su capacidad
          </p>
        </div>
      )}

      <div className="space-y-4">
        {alertas.map((a, i) => (
          <div key={i} className="bg-white border-l-4 border-red-500 rounded-xl shadow-sm p-5">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
                    🚨 SOBRECUPO
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{a.salonCodigo}</span>
                </div>
                <p className="font-semibold text-gray-800 text-base">{a.salonNombre}</p>
                <p className="text-sm text-gray-600 mt-1">📚 {a.materiaNombre}</p>
                <p className="text-sm text-gray-600">👨‍🏫 {a.docenteNombre}</p>
                <p className="text-xs text-gray-400 mt-1.5">
                  🕐 Libre a las {new Date(a.libreA).toLocaleTimeString("es-CO", {
                    hour: "2-digit", minute: "2-digit", timeZone: "America/Bogota",
                  })}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-3xl font-bold text-red-600">{a.matriculados}</p>
                <p className="text-xs text-gray-400">matriculados</p>
                <p className="text-sm text-gray-500 mt-0.5">cap. {a.capacidad}</p>
                <p className="text-xs font-bold text-red-600 mt-1">+{a.exceso} exceso</p>
              </div>
            </div>

            {/* Barra */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Nivel de ocupación</span>
                <span className="font-bold text-red-600">{a.porcentaje}%</span>
              </div>
              <div className="h-2.5 bg-red-100 rounded-full overflow-hidden">
                <div
                  className="bg-red-500 h-full rounded-full"
                  style={{ width: `${Math.min(a.porcentaje, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}