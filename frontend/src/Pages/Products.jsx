import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: ""
  });

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

  const handleChange = (e) => {
    setError("");
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.price ||
      !formData.category ||
      !formData.stock
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (formData.price <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    if (formData.stock < 0) {
      setError("El stock no puede ser negativo");
      return;
    }

    try {
      if (editingId) {

        await axios.put(
          `http://localhost:5000/api/products/${editingId}`,
          formData
        );

        alert("Producto actualizado");

        setEditingId(null);

      } else {

        await axios.post(
          "http://localhost:5000/api/products",
          formData
        );

        alert("Producto agregado");
      }

      setFormData({
        name: "",
        price: "",
        category: "",
        stock: ""
      });

      getProducts();

    } catch (error) {
      console.error("Error guardando producto");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "¿Seguro que deseas eliminar este producto?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );

      alert("Producto eliminado");

      getProducts();

    } catch (error) {
      console.error("Error eliminando producto");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setError("");

    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const filteredProducts = products.filter(
  (product) =>
    product.name
      .toLowerCase()
      .includes(search.toLowerCase()) ||

    product.category
      .toLowerCase()
      .includes(search.toLowerCase())
);

  return (
    <MainLayout>

      <h1 className="text-5xl font-bold text-center text-amber-900 mb-3">
        Gestión de Productos
      </h1>

      <p className="text-center text-orange-800 mb-10 text-lg">
        Administra los productos del restaurante
      </p>

      <ProductForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editingId={editingId}
        error={error}
      />

      <div className="bg-white rounded-3xl shadow-lg border border-orange-100 p-6 mb-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>

            <label className="block text-orange-900 font-semibold mb-3">
              Buscar producto
            </label>

            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

          </div>

          <div>

            <label className="block text-orange-900 font-semibold mb-3">
              Filtrar por categoría
            </label>

            <select
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-orange-200 bg-orange-50 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            >

              <option value="">
                Todas las categorías
              </option>

              {[...new Set(
                products.map(
                  (product) => product.category
                )
              )].map((category, index) => (
                <option
                  key={index}
                  value={category}
                >
                  {category}
                </option>
              ))}

            </select>

          </div>

        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}

      </div>

    </MainLayout>
  );
}

export default Products;