const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const tableRoutes = require("./routes/TableRoutes");
const orderRoutes = require("./routes/Orderroutes");
 
require("dotenv").config();
 
const app = express();
 
connectDB();
 
app.use(cors());
app.use(express.json());
 
app.use("/api/products", productRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
 
app.get("/", (req, res) => {
  res.json({
    message: "API Restaurante funcionando",
    endpoints: {
      products: "/api/products",
      tables: "/api/tables",
      orders: "/api/orders"
    }
  });
});
 
app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada"
  });
});
 
const PORT = process.env.PORT || 5000;
 
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});