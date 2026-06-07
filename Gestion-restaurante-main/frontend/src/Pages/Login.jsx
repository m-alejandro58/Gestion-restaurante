import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_HOME = {
  admin: "/",
  mesero: "/tables",
  cocinero: "/orders",
};

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      navigate(ROLE_HOME[user.role] || "/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff7f2] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2b1810] rounded-2xl mb-4 shadow-lg">
            <svg className="w-9 h-9 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-[#2b1810]">Restaurante Admin</h1>
          <p className="text-orange-700 mt-1 text-sm">Sistema de gestión</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Iniciar sesión</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="correo@restaurante.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-800 placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-gray-800 placeholder-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2b1810] text-white font-semibold rounded-xl hover:bg-orange-900 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-md"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          {/* Credenciales de demo */}
          <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <p className="text-xs font-bold text-orange-800 mb-2">Usuarios de prueba:</p>
            <div className="space-y-1 text-xs text-orange-700 font-mono">
              <p>admin@restaurante.com / admin123</p>
              <p>mesero@restaurante.com / mesero123</p>
              <p>cocina@restaurante.com / cocina123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
