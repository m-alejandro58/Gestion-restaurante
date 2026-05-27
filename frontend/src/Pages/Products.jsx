import { useEffect, useState } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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

  const filteredProducts = products.filter((product) =>
    product.name
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
      />

      <div className="mb-10">

        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-orange-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-sm"
        />

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