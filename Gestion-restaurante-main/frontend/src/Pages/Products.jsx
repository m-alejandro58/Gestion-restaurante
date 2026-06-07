import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import MainLayout from "../layouts/MainLayout";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
import Toast from "../components/Toast";
import ConfirmDialog from "../components/ConfirmDialog";

function Products() {
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [error, setError] = useState("");

  const [toast, setToast] = useState(null);

  const [confirmDialog, setConfirmDialog] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: ""
  });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products"
      );

      setProducts(response.data);

    } catch (error) {
      showToast("Error al obtener los productos", "error");
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

        showToast("Producto actualizado correctamente");

        setEditingId(null);

      } else {

        await axios.post(
          "http://localhost:5000/api/products",
          formData
        );

        showToast("Producto agregado correctamente");
      }

      setFormData({
        name: "",
        price: "",
        category: "",
        stock: ""
      });

      getProducts();

    } catch (error) {
      showToast("Error al guardar el producto", "error");
    }
  };

  const handleDelete = (id) => {
    setConfirmDialog({
      message: "¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.",
      onConfirm: async () => {
        setConfirmDialog(null);
        try {
          await axios.delete(
            `http://localhost:5000/api/products/${id}`
          );

          showToast("Producto eliminado correctamente");

          getProducts();

        } catch (error) {
          showToast("Error al eliminar el producto", "error");
        }
      },
      onCancel: () => setConfirmDialog(null)
    });
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

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={closeToast}
        />
      )}

      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={confirmDialog.onCancel}
        />
      )}

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
