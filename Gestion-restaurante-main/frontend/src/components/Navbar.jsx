import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_LABELS = { admin: "Admin", mesero: "Mesero", cocinero: "Cocinero" };
const ROLE_COLORS = {
  admin: "bg-purple-500",
  mesero: "bg-blue-500",
  cocinero: "bg-orange-500",
};

function Navbar() {
  const { user, logout, isAdmin, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // Definir links según rol
  const allLinks = [
    { to: "/",          label: "Inicio",      roles: ["admin"] },
    { to: "/products",  label: "Productos",   roles: ["admin"] },
    { to: "/inventory", label: "Inventario",  roles: ["admin"] },
    { to: "/tables",    label: "Mesas",       roles: ["admin", "mesero"] },
    { to: "/orders",    label: "Pedidos",     roles: ["admin", "mesero", "cocinero"] },
    { to: "/usuarios",  label: "Usuarios",    roles: ["admin"] },
  ];

  const visibleLinks = allLinks.filter(
    (link) => !link.roles || link.roles.includes(user?.role)
  );

  return (
    <nav className="bg-[#2b1810] shadow-xl border-b border-orange-900">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          <div>
            <h1 className="text-2xl font-bold text-orange-400 tracking-wide">
              Restaurante Admin
            </h1>
            <p className="text-orange-200 text-sm">Sistema de gestión</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {visibleLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl font-semibold text-sm transition duration-300 ${
                    isActive
                      ? "bg-orange-600 text-white shadow-lg"
                      : "text-orange-100 hover:bg-orange-800"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {/* Info del usuario */}
            <div className="ml-3 flex items-center gap-2 pl-3 border-l border-orange-800">
              <div className="text-right hidden sm:block">
                <p className="text-orange-100 text-sm font-semibold">{user?.name}</p>
                <span className={`text-xs text-white px-2 py-0.5 rounded-full ${ROLE_COLORS[user?.role]}`}>
                  {ROLE_LABELS[user?.role]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 bg-orange-800 hover:bg-orange-700 text-orange-100 rounded-xl text-sm font-semibold transition"
                title="Cerrar sesión"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
