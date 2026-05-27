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

            <p className="text-orange-200 text-sm">
              Sistema de gestión
            </p>

          </div>

          <div className="flex gap-4">

            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-5 py-3 rounded-xl font-semibold transition duration-300 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg"
                    : "text-orange-100 hover:bg-orange-800"
                }`
              }
            >
              Inicio
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                `px-5 py-3 rounded-xl font-semibold transition duration-300 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg"
                    : "text-orange-100 hover:bg-orange-800"
                }`
              }
            >
              Productos
            </NavLink>

            <NavLink
              to="/inventory"
              className={({ isActive }) =>
                `px-5 py-3 rounded-xl font-semibold transition duration-300 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg"
                    : "text-orange-100 hover:bg-orange-800"
                }`
              }
            >
              Inventario
            </NavLink>

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;