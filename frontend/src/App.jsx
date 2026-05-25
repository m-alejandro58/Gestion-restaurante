import { useEffect, useState } from "react";
import axios from "axios";

function App() {
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

  return (
    <div style={{ padding: "20px" }}>
      <h1>Gestión Restaurante</h1>

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
        </div>
      ))}
    </div>
  );
}

export default App;