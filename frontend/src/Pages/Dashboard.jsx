import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const [products, setProducts] = useState([]);

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

  const totalProducts = products.length;

  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size;

  const outOfStock = products.filter(
    (product) => product.stock === 0
  ).length;

  const categoriesData = Object.values(
    products.reduce((acc, product) => {

      if (!acc[product.category]) {
        acc[product.category] = {
          name: product.category,
          value: 0
        };
      }

      acc[product.category].value += 1;

      return acc;

    }, {})
  );

  const COLORS = [
    "#ea580c",
    "#f59e0b",
    "#b45309",
    "#fb923c",
    "#92400e"
  ];

  return (
    <MainLayout>

      <div className="bg-gradient-to-r from-[#2b1810] to-orange-700 rounded-3xl p-12 text-white shadow-2xl mb-12">

        <h1 className="text-6xl font-bold mb-5">
          Inicio
        </h1>

        <p className="text-xl text-orange-100 max-w-3xl leading-relaxed">
          Panel principal del sistema administrativo
          para la gestión de productos e inventario.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8">

          <p className="text-orange-700 text-lg mb-3">
            Productos registrados
          </p>

          <h2 className="text-5xl font-bold text-amber-900">
            {totalProducts}
          </h2>

        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8">

          <p className="text-orange-700 text-lg mb-3">
            Categorías
          </p>

          <h2 className="text-5xl font-bold text-amber-900">
            {totalCategories}
          </h2>

        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8">

          <p className="text-orange-700 text-lg mb-3">
            Productos agotados
          </p>

          <h2 className="text-5xl font-bold text-red-600">
            {outOfStock}
          </h2>

        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg border border-orange-100 p-8">

          <div className="flex justify-between items-center mb-8">

            <div>

              <h2 className="text-3xl font-bold text-amber-900">
                Categorías de Productos
              </h2>

              <p className="text-orange-700 mt-2">
                Distribución de productos por categoría
              </p>

            </div>

          </div>

          <div className="h-[400px]">

            <ResponsiveContainer width="100%" height="100%">

              <PieChart>

                <Pie
                  data={categoriesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  dataKey="value"
                  label
                >

                  {categoriesData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-8">

          <h2 className="text-3xl font-bold text-amber-900 mb-8">
            Accesos Rápidos
          </h2>

          <div className="flex flex-col gap-5">

            <Link
              to="/products"
              className="border border-orange-200 hover:border-orange-400 hover:bg-orange-50 rounded-2xl p-5 transition"
            >

              <h3 className="text-xl font-bold text-amber-900 mb-1">
                Productos
              </h3>

              <p className="text-orange-700">
                Gestionar productos
              </p>

            </Link>

            <Link
              to="/inventory"
              className="border border-orange-200 hover:border-orange-400 hover:bg-orange-50 rounded-2xl p-5 transition"
            >

              <h3 className="text-xl font-bold text-amber-900 mb-1">
                Inventario
              </h3>

              <p className="text-orange-700">
                Ver estado del stock
              </p>

            </Link>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Dashboard;