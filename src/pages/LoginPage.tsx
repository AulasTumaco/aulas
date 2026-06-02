import { useState } from "react";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const { login } = useAuth();
    const [tab, setTab] = useState<"login" | "register">("login");
    const [form, setForm] = useState({ fullName: "", email: "", password: "" });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError(null);
        if (!form.email || !form.password) { setError("Completa todos los campos"); return; }
        setLoading(true);
        try {
            const res = await authApi.login({ email: form.email, password: form.password });
            login(res.access_token, res.user);
        } catch {
            setError("Credenciales inválidas. Verifica tu email y contraseña.");
        } finally { setLoading(false); }
    };

    const handleRegister = async () => {
        setError(null);
        if (!form.fullName || !form.email || !form.password) { setError("Completa todos los campos"); return; }
        if (form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return; }
        setLoading(true);
        try {
            await authApi.register({ fullName: form.fullName, email: form.email, password: form.password });
            const res = await authApi.login({ email: form.email, password: form.password });
            login(res.access_token, res.user);
        } catch (e: any) {
            setError(e.message ?? "Error al registrarse");
        } finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen flex">

            {/* Panel izquierdo — descripción del sistema */}
            <div
                className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0ea5e9 100%)" }}
            >
                {/* Decoración de fondo */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-white" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white" />
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-white" />
                </div>

                {/* Logo y nombre */}
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-5xl">🏫</span>
                        <div>
                            <h1 className="text-3xl font-bold text-white">AulasTumaco</h1>
                            <p className="text-blue-200 text-sm">Universidad de Nariño · Sede Tumaco</p>
                        </div>
                    </div>
                </div>

                {/* Descripción central */}
                <div className="relative z-10 space-y-8">
                    <div>
                        <h2 className="text-4xl font-bold text-white leading-tight mb-4">
                            Gestión de aulas<br />
                            <span className="text-sky-300">en tiempo real</span>
                        </h2>
                        <p className="text-blue-100 text-lg leading-relaxed">
                            Visualiza el estado de cada salón al instante. Sin llamadas, sin papeles,
                            sin información desactualizada.
                        </p>
                    </div>

                    {/* Características */}
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-lg">📊</span>
                            </div>
                            <div>
                                <p className="text-white font-semibold">Dashboard en tiempo real</p>
                                <p className="text-blue-200 text-sm">
                                    Ve de un vistazo qué salones están libres, ocupados o reservados en este momento.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-lg">🚨</span>
                            </div>
                            <div>
                                <p className="text-white font-semibold">Alertas automáticas de sobrecupo</p>
                                <p className="text-blue-200 text-sm">
                                    El sistema detecta cuando los matriculados superan la capacidad del salón
                                    y avisa antes de que ocurra el problema.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-lg">📅</span>
                            </div>
                            <div>
                                <p className="text-white font-semibold">Reservas sin conflictos</p>
                                <p className="text-blue-200 text-sm">
                                    Asigna salones a materias y docentes con validación automática
                                    de horarios y capacidad.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-lg">🎓</span>
                            </div>
                            <div>
                                <p className="text-white font-semibold">Para coordinadores académicos</p>
                                <p className="text-blue-200 text-sm">
                                    Diseñado para el personal administrativo de UniNariño sede Tumaco
                                    que necesita control total de los espacios físicos.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer izquierdo */}
                <div className="relative z-10">
                    <div className="flex gap-6 text-blue-200 text-sm">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">5+</p>
                            <p>Entidades</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">∞</p>
                            <p>Salones</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">24/7</p>
                            <p>Disponible</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Panel derecho — formulario */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">

                    {/* Logo móvil — solo visible en pantallas pequeñas */}
                    <div className="lg:hidden text-center mb-8">
                        <span className="text-5xl">🏫</span>
                        <h1 className="text-2xl font-bold text-gray-800 mt-2">AulasTumaco</h1>
                        <p className="text-gray-500 text-sm">Universidad de Nariño · Sede Tumaco</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

                        {/* Header del formulario */}
                        <div className="px-8 pt-8 pb-4">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {tab === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                {tab === "login"
                                    ? "Ingresa tus credenciales para acceder al sistema"
                                    : "Regístrate para acceder al sistema de gestión de aulas"}
                            </p>
                        </div>

                        {/* Tabs */}
                        <div className="flex mx-8 bg-gray-100 rounded-xl p-1 mb-6">
                            <button
                                onClick={() => { setTab("login"); setError(null); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === "login"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Iniciar sesión
                            </button>
                            <button
                                onClick={() => { setTab("register"); setError(null); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === "register"
                                        ? "bg-white text-blue-600 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                Registrarse
                            </button>
                        </div>

                        {/* Campos */}
                        <div className="px-8 pb-8 space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                                    <span className="text-red-500 mt-0.5">⚠️</span>
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            {tab === "register" && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                        Nombre completo
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Darwin Iturre"
                                        value={form.fullName}
                                        onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    placeholder="tu@udenar.edu.co"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                                    Contraseña
                                </label>
                                <input
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            tab === "login" ? handleLogin() : handleRegister();
                                        }
                                    }}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                                />
                            </div>

                            <button
                                onClick={tab === "login" ? handleLogin : handleRegister}
                                disabled={loading}
                                className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                                style={{ background: "linear-gradient(135deg, #1d4ed8, #0ea5e9)" }}
                            >
                                {loading
                                    ? "⏳ Procesando..."
                                    : tab === "login"
                                        ? "→ Ingresar al sistema"
                                        : "→ Crear mi cuenta"}
                            </button>

                            {/* Info adicional */}
                            <div className="pt-4 border-t border-gray-100">
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div className="bg-green-50 rounded-xl p-3">
                                        <p className="text-lg">🏫</p>
                                        <p className="text-xs text-green-700 font-medium mt-1">Salones</p>
                                        <p className="text-xs text-green-600">en tiempo real</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-3">
                                        <p className="text-lg">📊</p>
                                        <p className="text-xs text-blue-700 font-medium mt-1">Dashboard</p>
                                        <p className="text-xs text-blue-600">interactivo</p>
                                    </div>
                                    <div className="bg-orange-50 rounded-xl p-3">
                                        <p className="text-lg">🚨</p>
                                        <p className="text-xs text-orange-700 font-medium mt-1">Alertas</p>
                                        <p className="text-xs text-orange-600">automáticas</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-xs text-gray-400 pt-2">
                                Sistema de gestión de aulas · UniNariño Tumaco · 2026
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
