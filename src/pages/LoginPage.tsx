import { useState } from "react";
import { authApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(null);
    if (!form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.login({
        email: form.email,
        password: form.password,
      });
      login(res.access_token, res.user);
    } catch {
      setError("Credenciales inválidas. Verifica tu email y contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    if (!form.fullName || !form.email || !form.password) {
      setError("Completa todos los campos");
      return;
    }
    if (form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    setLoading(true);
    try {
      await authApi.register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      // Después de registrar, hace login automáticamente
      const res = await authApi.login({
        email: form.email,
        password: form.password,
      });
      login(res.access_token, res.user);
    } catch (e: any) {
      setError(e.message ?? "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 px-8 py-6 text-center">
          <p className="text-4xl mb-2">🏫</p>
          <h1 className="text-2xl font-bold text-white">AulasTumaco</h1>
          <p className="text-blue-200 text-sm mt-1">
            Universidad de Nariño sede Tumaco
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => { setTab("login"); setError(null); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "login"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setTab("register"); setError(null); }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "register"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Form */}
        <div className="px-8 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">🚨 {error}</p>
            </div>
          )}

          {tab === "register" && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Darwin Iturre"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="darwin@udenar.edu.co"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              placeholder="mínimo 6 caracteres"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  tab === "login" ? handleLogin() : handleRegister();
                }
              }}
              className="w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={tab === "login" ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading
              ? "Procesando..."
              : tab === "login"
              ? "Ingresar al sistema"
              : "Crear cuenta"}
          </button>
        </div>

        <div className="px-8 pb-6 text-center">
          <p className="text-xs text-gray-400">
            Sistema de gestión de aulas en tiempo real
          </p>
        </div>
      </div>
    </div>
  );
}
