import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";

function App() {
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("Todas");

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
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

        setEditingId(null);

        showSuccessMessage(
          "Producto actualizado correctamente"
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/products",
          formData
        );

        showSuccessMessage(
          "Producto agregado correctamente"
        );
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
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );

      showSuccessMessage(
        "Producto eliminado correctamente"
      );

      getProducts();

    } catch (error) {
      console.error("Error eliminando producto");
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock
    });
  };

  const totalProducts = products.length;

  const totalCategories = new Set(
    products.map((product) => product.category)
  ).size;

  const totalInventoryValue = products.reduce(
    (acc, product) =>
      acc + product.price * product.stock,
    0
  );

  const categories = [
    "Todas",
    ...new Set(
      products.map((product) => product.category)
    )
  ];

  const filteredProducts = products.filter(
    (product) => {
      const matchesSearch =
        product.name
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "Todas" ||
        product.category === selectedCategory;

      return (
        matchesSearch && matchesCategory
      );
    }
  );

  return (
    <div className="min-h-screen bg-orange-50 p-8">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-center text-amber-900 mb-3">
          Sistema de Gestión Restaurante
        </h1>

        <p className="text-center text-orange-800 mb-10 text-lg">
          Control de inventario y administración de productos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 text-center">
            <h3 className="text-xl font-semibold text-orange-700 mb-2">
              Productos
            </h3>

            <p className="text-4xl font-bold text-amber-900">
              {totalProducts}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 text-center">
            <h3 className="text-xl font-semibold text-orange-700 mb-2">
              Categorías
            </h3>

            <p className="text-4xl font-bold text-amber-900">
              {totalCategories}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 text-center">
            <h3 className="text-xl font-semibold text-orange-700 mb-2">
              Valor Inventario
            </h3>

            <p className="text-4xl font-bold text-amber-900">
              ${totalInventoryValue}
            </p>
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-orange-100">

          <h2 className="text-3xl font-semibold text-amber-900 text-center mb-8">
            {editingId
              ? "Editar Producto"
              : "Agregar Producto"}
          </h2>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 text-center">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <input
              type="text"
              name="name"
              placeholder="Nombre del producto"
              value={formData.name}
              onChange={handleChange}
              className="border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="number"
              name="price"
              placeholder="Precio"
              value={formData.price}
              onChange={handleChange}
              className="border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="text"
              name="category"
              placeholder="Categoría"
              value={formData.category}
              onChange={handleChange}
              className="border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <input
              type="number"
              name="stock"
              placeholder="Stock disponible"
              value={formData.stock}
              onChange={handleChange}
              className="border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <div className="md:col-span-2 flex justify-center">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-10 py-4 rounded-xl transition duration-300 shadow-md"
              >
                {editingId
                  ? "Actualizar Producto"
                  : "Guardar Producto"}
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-5">

          <h2 className="text-4xl font-bold text-amber-900">
            Productos Registrados
          </h2>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">

            <input
              type="text"
              placeholder="Buscar producto..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="border border-orange-200 p-4 rounded-xl w-full md:w-[250px] focus:outline-none focus:ring-2 focus:ring-orange-400"
            />

            <select
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
              className="border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

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

      </div>
    </div>
  );
}

export default App;