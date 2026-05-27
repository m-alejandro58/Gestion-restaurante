import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-[#2b1810] shadow-xl border-b border-orange-900">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center h-20">
          <div>
            <h1 className="text-3xl font-bold text-orange-400 tracking-wide">
              Restaurante Admin
            </h1>
            <p className="text-orange-200 text-sm">Sistema de gestión</p>
          </div>

          <div className="flex gap-2 flex-wrap justify-end">
            {[
              { to: "/",          label: "Inicio" },
              { to: "/products",  label: "Productos" },
              { to: "/inventory", label: "Inventario" },
              { to: "/tables",    label: "Mesas" },
              { to: "/orders",    label: "Pedidos" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-5 py-3 rounded-xl font-semibold transition duration-300 ${
                    isActive
                      ? "bg-orange-600 text-white shadow-lg"
                      : "text-orange-100 hover:bg-orange-800"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
