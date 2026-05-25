import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

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
      await axios.post(
        "http://localhost:5000/api/products",
        formData
      );

      setFormData({
        name: "",
        price: "",
        category: "",
        stock: ""
      });

      getProducts();
    } catch (error) {
      console.error("Error creando producto");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/products/${id}`
      );

      getProducts();
    } catch (error) {
      console.error("Error eliminando producto");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión Restaurante</h1>

      <h2>Agregar Producto</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          value={formData.name}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="price"
          placeholder="Precio"
          value={formData.price}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="text"
          name="category"
          placeholder="Categoría"
          value={formData.category}
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={formData.stock}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">
          Guardar Producto
        </button>
      </form>

      <hr />

      <h2>Productos</h2>

      {products.map((product) => (
        <div
          key={product._id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            marginBottom: "10px"
          }}
        >
          <h3>{product.name}</h3>

          <p>Precio: ${product.price}</p>

          <p>Categoría: {product.category}</p>

          <p>Stock: {product.stock}</p>

          <button
            onClick={() => handleDelete(product._id)}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;