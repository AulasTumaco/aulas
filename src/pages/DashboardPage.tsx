import { useEffect, useState } from "react";
import { salonesApi, type SalonDashboard } from "../api/salones";

export default function DashboardPage() {
  const [salones, setSalones] = useState<SalonDashboard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refrescarDatos = () => {
      salonesApi.dashboard()
        .then(setSalones)
        .catch((err) => console.error("Error al actualizar:", err));
    };

    setLoading(true);
    refrescarDatos();

    const interval = setInterval(refrescarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const libres = salones.filter((s) => s.estado === "LIBRE").length;
  const ocupados = salones.filter((s) => s.estado === "OCUPADO").length;
  const reservados = salones.filter((s) => s.estado === "RESERVADO").length;
  const alertas = salones.filter((s) => s.alerta).length;

  const colorEstado = (estado: string) => {
    if (estado === "LIBRE") return "bg-green-100 text-green-700";
    if (estado === "OCUPADO") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard en tiempo real</h1>
        <p className="text-gray-500 text-sm">Estado actual de todos los salones</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-600 text-white rounded-xl p-4"><p className="text-sm">Libres</p><h2 className="text-4xl font-bold">{libres}</h2></div>
        <div className="bg-red-600 text-white rounded-xl p-4"><p className="text-sm">Ocupados</p><h2 className="text-4xl font-bold">{ocupados}</h2></div>
        <div className="bg-yellow-500 text-white rounded-xl p-4"><p className="text-sm">Reservados</p><h2 className="text-4xl font-bold">{reservados}</h2></div>
        <div className="bg-orange-600 text-white rounded-xl p-4"><p className="text-sm">Alertas</p><h2 className="text-4xl font-bold">{alertas}</h2></div>
      </div>

      {loading && salones.length === 0 && <p className="text-gray-500 text-sm">Cargando datos...</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {salones.map((salon) => (
          <div key={salon.id} className="bg-white rounded-xl border p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-gray-800">{salon.nombre}</p>
                <p className="text-xs text-gray-500">{salon.edificio} · cap. {salon.capacidad}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${colorEstado(salon.estado)}`}>
                {salon.estado}
              </span>
            </div>

            {salon.reservaActiva && (
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <p>📚 {salon.reservaActiva.materia?.nombre ?? "Sin materia"}</p>
                <p>👨‍🏫 {salon.reservaActiva.docente?.nombreCompleto ?? "Sin docente"}</p>
                <p>🕐 Libre a las {salon.reservaActiva.horaFin ? new Date(salon.reservaActiva.horaFin).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }) : "N/A"}</p>
                
                <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, ((salon.reservaActiva.materia?.matriculados ?? 0) / (salon.capacidad || 1)) * 100)}%` }}
                  />
                </div>
                <p className="text-xs">{(salon.reservaActiva.materia?.matriculados ?? 0)}/{salon.capacidad} estudiantes</p>
              </div>
            )}

            {salon.alerta && (
              <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700">
                ⚠️ {salon.alerta}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}