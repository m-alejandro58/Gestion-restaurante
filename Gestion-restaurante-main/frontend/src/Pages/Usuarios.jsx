import { useState, useEffect } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

const ROLE_LABELS = { admin: "Admin", mesero: "Mesero", cocinero: "Cocinero" };
const ROLE_COLORS = {
  admin:    "bg-purple-100 text-purple-800",
  mesero:   "bg-blue-100 text-blue-800",
  cocinero: "bg-orange-100 text-orange-800",
};

const API = "http://localhost:5000/api";

function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "mesero" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/auth/users`);
      setUsers(res.data);
    } catch {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      await axios.post(`${API}/auth/register`, form);
      setSuccess("Usuario creado correctamente");
      setForm({ name: "", email: "", password: "", role: "mesero" });
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear usuario");
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`¿Desactivar a ${name}?`)) return;
    try {
      await axios.delete(`${API}/auth/users/${id}`);
      fetchUsers();
    } catch {
      setError("Error al desactivar usuario");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-[#2b1810]">Gestión de Usuarios</h2>
            <p className="text-orange-700 text-sm mt-1">Administra los accesos del sistema</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setError(""); setSuccess(""); }}
            className="px-5 py-2.5 bg-[#2b1810] text-white rounded-xl font-semibold hover:bg-orange-900 transition shadow"
          >
            {showForm ? "Cancelar" : "+ Nuevo usuario"}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{success}</div>
        )}

        {/* Formulario nuevo usuario */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-orange-100 shadow p-6">
            <h3 className="font-bold text-[#2b1810] mb-4">Crear nuevo usuario</h3>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                <input
                  type="text" required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password" required minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Rol</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="mesero">Mesero</option>
                  <option value="cocinero">Cocinero</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#2b1810] text-white rounded-xl font-semibold hover:bg-orange-900 transition"
                >
                  Crear usuario
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de usuarios */}
        {loading ? (
          <p className="text-orange-700 animate-pulse">Cargando usuarios...</p>
        ) : (
          <div className="bg-white rounded-2xl border border-orange-100 shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#2b1810] text-orange-100">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Nombre</th>
                  <th className="px-6 py-3 text-left font-semibold">Email</th>
                  <th className="px-6 py-3 text-left font-semibold">Rol</th>
                  <th className="px-6 py-3 text-left font-semibold">Estado</th>
                  <th className="px-6 py-3 text-left font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-orange-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-800">{u.name}</td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${ROLE_COLORS[u.role]}`}>
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        u.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                      }`}>
                        {u.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.active && (
                        <button
                          onClick={() => handleDelete(u._id, u.name)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs transition"
                        >
                          Desactivar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Descripción de roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { role: "Admin", color: "purple", desc: "Acceso completo: dashboard, productos, inventario, mesas, pedidos y usuarios." },
            { role: "Mesero", color: "blue", desc: "Gestión de mesas y pedidos. Puede crear y actualizar pedidos." },
            { role: "Cocinero", color: "orange", desc: "Vista de pedidos activos. Puede cambiar el estado a 'en preparación' o 'listo'." },
          ].map(({ role, color, desc }) => (
            <div key={role} className={`p-4 bg-${color}-50 border border-${color}-100 rounded-xl`}>
              <p className={`font-bold text-${color}-800 mb-1`}>{role}</p>
              <p className={`text-sm text-${color}-700`}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default Usuarios;
