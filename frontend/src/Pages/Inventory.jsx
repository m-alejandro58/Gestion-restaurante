import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";

function Inventory() {
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

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return {
        text: "Agotado",
        style:
          "bg-red-100 text-red-700"
      };
    }

    if (stock <= 5) {
      return {
        text: "Bajo",
        style:
          "bg-yellow-100 text-yellow-700"
      };
    }

    return {
      text: "Disponible",
      style:
        "bg-green-100 text-green-700"
    };
  };

  return (
    <MainLayout>

      <h1 className="text-5xl font-bold text-center text-amber-900 mb-3">
        Inventario
      </h1>

      <p className="text-center text-orange-800 mb-10 text-lg">
        Monitoreo y control del stock de productos
      </p>

      <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-orange-600 text-white">

              <tr>

                <th className="text-left px-6 py-4 text-lg">
                  Producto
                </th>

                <th className="text-left px-6 py-4 text-lg">
                  Categoría
                </th>

                <th className="text-left px-6 py-4 text-lg">
                  Precio
                </th>

                <th className="text-left px-6 py-4 text-lg">
                  Stock
                </th>

                <th className="text-left px-6 py-4 text-lg">
                  Estado
                </th>

              </tr>

            </thead>

            <tbody>

              {products.map((product) => {
                const status =
                  getStockStatus(product.stock);

                return (
                  <tr
                    key={product._id}
                    className="border-b border-orange-100 hover:bg-orange-50 transition"
                  >

                    <td className="px-6 py-5 font-semibold text-amber-900">
                      {product.name}
                    </td>

                    <td className="px-6 py-5 text-orange-800">
                      {product.category}
                    </td>

                    <td className="px-6 py-5 text-orange-800">
                      ${product.price}
                    </td>

                    <td className="px-6 py-5 text-orange-800 font-bold">
                      {product.stock}
                    </td>

                    <td className="px-6 py-5">

                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold ${status.style}`}
                      >
                        {status.text}
                      </span>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

    </MainLayout>
  );
}

export default Inventory;