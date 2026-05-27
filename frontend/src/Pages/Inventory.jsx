import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const getProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error obteniendo productos");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: "Agotado", style: "bg-red-100 text-red-700 border border-red-200", dot: "bg-red-500" };
    if (stock <= 5) return { text: "Stock bajo", style: "bg-yellow-100 text-yellow-700 border border-yellow-200", dot: "bg-yellow-500" };
    return { text: "Disponible", style: "bg-green-100 text-green-700 border border-green-200", dot: "bg-green-500" };
  };

  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const available = products.filter((p) => p.stock > 5).length;

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    if (filter === "out") return p.stock === 0 && matchesSearch;
    if (filter === "low") return p.stock > 0 && p.stock <= 5 && matchesSearch;
    if (filter === "ok") return p.stock > 5 && matchesSearch;
    return matchesSearch;
  });

  return (
    <MainLayout>

      <h1 className="text-5xl font-bold text-center text-amber-900 mb-3">
        Inventario
      </h1>

      <p className="text-center text-orange-800 mb-10 text-lg">
        Monitoreo y control del stock de productos
      </p>

      {/* Resumen de estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        <button
          onClick={() => setFilter(filter === "out" ? "all" : "out")}
          className={`rounded-2xl p-6 text-left border-2 transition ${
            filter === "out"
              ? "border-red-400 bg-red-50"
              : "border-transparent bg-white hover:border-red-200"
          } shadow-md`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
            <span className="text-red-700 font-semibold">Agotados</span>
          </div>
          <p className="text-4xl font-bold text-red-600">{outOfStock}</p>
          <p className="text-sm text-red-400 mt-1">productos sin stock</p>
        </button>

        <button
          onClick={() => setFilter(filter === "low" ? "all" : "low")}
          className={`rounded-2xl p-6 text-left border-2 transition ${
            filter === "low"
              ? "border-yellow-400 bg-yellow-50"
              : "border-transparent bg-white hover:border-yellow-200"
          } shadow-md`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
            <span className="text-yellow-700 font-semibold">Stock bajo</span>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{lowStock}</p>
          <p className="text-sm text-yellow-400 mt-1">5 unidades o menos</p>
        </button>

        <button
          onClick={() => setFilter(filter === "ok" ? "all" : "ok")}
          className={`rounded-2xl p-6 text-left border-2 transition ${
            filter === "ok"
              ? "border-green-400 bg-green-50"
              : "border-transparent bg-white hover:border-green-200"
          } shadow-md`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
            <span className="text-green-700 font-semibold">Disponibles</span>
          </div>
          <p className="text-4xl font-bold text-green-600">{available}</p>
          <p className="text-sm text-green-400 mt-1">con stock suficiente</p>
        </button>

      </div>

      {/* Buscador y filtro activo */}
      <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-5 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">

        <input
          type="text"
          placeholder="Buscar por nombre o categoría..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 border border-orange-200 bg-orange-50 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
        />

        {filter !== "all" && (
          <button
            onClick={() => setFilter("all")}
            className="text-sm text-orange-700 border border-orange-300 px-4 py-2 rounded-xl hover:bg-orange-50 transition"
          >
            Limpiar filtro ×
          </button>
        )}

        <p className="text-sm text-orange-600 ml-auto">
          Mostrando <span className="font-bold">{filtered.length}</span> de {products.length} productos
        </p>

      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gradient-to-r from-[#2b1810] to-orange-700 text-white">
              <tr>
                <th className="text-left px-6 py-4 font-semibold">#</th>
                <th className="text-left px-6 py-4 font-semibold">Producto</th>
                <th className="text-left px-6 py-4 font-semibold">Categoría</th>
                <th className="text-left px-6 py-4 font-semibold">Precio</th>
                <th className="text-left px-6 py-4 font-semibold">Stock</th>
                <th className="text-left px-6 py-4 font-semibold">Estado</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-orange-400 text-lg">
                    No se encontraron productos
                  </td>
                </tr>
              ) : (
                filtered.map((product, index) => {
                  const status = getStockStatus(product.stock);
                  const isEven = index % 2 === 0;

                  return (
                    <tr
                      key={product._id}
                      className={`border-b border-orange-50 hover:bg-orange-50 transition ${
                        isEven ? "bg-white" : "bg-orange-50/30"
                      }`}
                    >
                      <td className="px-6 py-4 text-orange-400 text-sm font-medium">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-semibold text-amber-900">
                        {product.name}
                      </td>

                      <td className="px-6 py-4">
                        <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {product.category}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-orange-800 font-semibold">
                        ${product.price.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${status.dot}`}></span>
                          <span className={`font-bold text-lg ${
                            product.stock === 0
                              ? "text-red-600"
                              : product.stock <= 5
                              ? "text-yellow-600"
                              : "text-green-700"
                          }`}>
                            {product.stock}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.style}`}>
                          {status.text}
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>

          </table>

        </div>

      </div>

    </MainLayout>
  );
}

export default Inventory;