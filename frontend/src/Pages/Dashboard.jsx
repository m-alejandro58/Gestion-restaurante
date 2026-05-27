import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

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

  return (
    <MainLayout>

      <div className="bg-gradient-to-r from-orange-700 to-amber-600 rounded-3xl p-12 text-white shadow-2xl mb-12">

        <h1 className="text-6xl font-bold mb-5">
          Restaurante Admin
        </h1>

        <p className="text-xl text-orange-100 max-w-3xl leading-relaxed">
          Sistema administrativo diseñado para la gestión
          de productos e inventario de restaurantes.
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

        <Link
          to="/products"
          className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100 hover:shadow-2xl hover:-translate-y-1 transition"
        >

          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Productos
          </h2>

          <p className="text-orange-700 text-lg leading-relaxed">
            Administra productos, registra nuevos
            elementos y actualiza información.
          </p>

        </Link>

        <Link
          to="/inventory"
          className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100 hover:shadow-2xl hover:-translate-y-1 transition"
        >

          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Inventario
          </h2>

          <p className="text-orange-700 text-lg leading-relaxed">
            Supervisa el stock disponible y controla
            productos agotados o con pocas unidades.
          </p>

        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-orange-100">

          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Estado General
          </h2>

          <div className="space-y-4 text-lg text-orange-800">

            <p>
              <span className="font-semibold">
                Productos:
              </span>{" "}
              {totalProducts}
            </p>

            <p>
              <span className="font-semibold">
                Categorías:
              </span>{" "}
              {totalCategories}
            </p>

            <p>
              <span className="font-semibold">
                Agotados:
              </span>{" "}
              {outOfStock}
            </p>

          </div>

        </div>

      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-10">

        <h2 className="text-4xl font-bold text-amber-900 mb-5">
          Acerca del Sistema
        </h2>

        <p className="text-orange-800 text-lg leading-relaxed">
          Este sistema permite gestionar productos,
          controlar inventario y organizar información
          administrativa de un restaurante mediante
          tecnologías modernas como React, Node.js,
          Express y MongoDB.
        </p>

      </div>

    </MainLayout>
  );
}

export default Dashboard;