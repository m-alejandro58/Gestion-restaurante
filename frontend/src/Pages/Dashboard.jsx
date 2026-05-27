import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const COLORS = ["#ea580c", "#f59e0b", "#b45309", "#fb923c", "#92400e"];

function StatCard({ label, value, sub, valueColor = "text-amber-900", icon }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-7 flex items-center gap-5">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-orange-600 text-sm font-medium mb-1">{label}</p>
        <h2 className={`text-5xl font-bold ${valueColor}`}>{value}</h2>
        {sub && <p className="text-orange-400 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function Dashboard() {
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error obteniendo productos");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const totalProducts = products.length;
  const totalCategories = new Set(products.map((p) => p.category)).size;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;

  const categoriesData = Object.values(
    products.reduce((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = { name: product.category, value: 0 };
      }
      acc[product.category].value += 1;
      return acc;
    }, {})
  );

  const lowStockProducts = [...products]
    .filter((p) => p.stock <= 10)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6)
    .map((p) => ({ name: p.name.length > 14 ? p.name.slice(0, 14) + "…" : p.name, stock: p.stock }));

  return (
    <MainLayout>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#2b1810] to-orange-700 rounded-3xl p-10 text-white shadow-2xl mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <p className="text-orange-300 font-semibold text-sm mb-2 uppercase tracking-widest">Panel de control</p>
          <h1 className="text-5xl font-bold mb-3">Restaurante Admin</h1>
          <p className="text-orange-100 max-w-md leading-relaxed">
            Resumen general del sistema. Gestioná productos, controlá el inventario y tomá decisiones desde un solo lugar.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            to="/products"
            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-2xl transition"
          >
            Ir a Productos →
          </Link>
          <Link
            to="/inventory"
            className="bg-orange-500 hover:bg-orange-400 text-white font-semibold px-6 py-3 rounded-2xl transition shadow-lg"
          >
            Ver Inventario →
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon="📦" label="Productos registrados" value={totalProducts} sub="en el sistema" />
        <StatCard icon="🏷️" label="Categorías" value={totalCategories} sub="distintas" />
        <StatCard icon="⚠️" label="Stock bajo" value={lowStock} sub="5 unidades o menos" valueColor="text-yellow-600" />
        <StatCard icon="🚫" label="Agotados" value={outOfStock} sub="sin unidades" valueColor="text-red-600" />
      </div>

      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

        {/* Pie chart */}
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-1">Distribución por categoría</h2>
          <p className="text-orange-600 text-sm mb-6">Cantidad de productos por cada categoría</p>
          {categoriesData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-orange-300">Sin datos</div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoriesData} cx="50%" cy="50%" outerRadius={110} innerRadius={50} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={true}>
                    {categoriesData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} productos`, "Cantidad"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Bar chart stock bajo */}
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-1">Productos con poco stock</h2>
          <p className="text-orange-600 text-sm mb-6">Los 6 productos con menor cantidad disponible</p>
          {lowStockProducts.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-green-400 font-semibold">
              ✓ Todo el inventario está bien surtido
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={lowStockProducts} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fff0e6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#92400e" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#92400e" }} />
                  <Tooltip
                    formatter={(value) => [`${value} uds.`, "Stock"]}
                    contentStyle={{ borderRadius: "12px", border: "1px solid #fed7aa" }}
                  />
                  <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                    {lowStockProducts.map((entry, index) => (
                      <Cell
                        key={`bar-${index}`}
                        fill={entry.stock === 0 ? "#ef4444" : entry.stock <= 5 ? "#f59e0b" : "#ea580c"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* Tabla top productos agotados / bajo stock */}
      {(outOfStock > 0 || lowStock > 0) && (
        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8">
          <h2 className="text-2xl font-bold text-amber-900 mb-1">Productos que necesitan atención</h2>
          <p className="text-orange-600 text-sm mb-6">Agotados y con stock bajo</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-orange-100">
                  <th className="text-left px-4 py-3 text-orange-700 font-semibold">Producto</th>
                  <th className="text-left px-4 py-3 text-orange-700 font-semibold">Categoría</th>
                  <th className="text-left px-4 py-3 text-orange-700 font-semibold">Stock</th>
                  <th className="text-left px-4 py-3 text-orange-700 font-semibold">Estado</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter((p) => p.stock <= 5)
                  .sort((a, b) => a.stock - b.stock)
                  .map((product) => (
                    <tr key={product._id} className="border-b border-orange-50 hover:bg-orange-50 transition">
                      <td className="px-4 py-3 font-semibold text-amber-900">{product.name}</td>
                      <td className="px-4 py-3">
                        <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-lg">
                        <span className={product.stock === 0 ? "text-red-600" : "text-yellow-600"}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {product.stock === 0 ? (
                          <span className="bg-red-100 text-red-700 border border-red-200 text-xs font-semibold px-3 py-1 rounded-full">Agotado</span>
                        ) : (
                          <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-semibold px-3 py-1 rounded-full">Stock bajo</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </MainLayout>
  );
}

export default Dashboard;