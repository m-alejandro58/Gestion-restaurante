const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const tableRoutes = require("./routes/TableRoutes");
const orderRoutes = require("./routes/Orderroutes");
const authRoutes = require("./routes/authRoutes");
const { authMiddleware, requireRole } = require("./middleware/auth");

require("dotenv").config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Rutas públicas (login)
app.use("/api/auth", authRoutes);

// Rutas protegidas por rol
// Admin: acceso total a productos e inventario
app.use("/api/products", authMiddleware, productRoutes);

// Admin y mesero: gestión de mesas
app.use("/api/tables", authMiddleware, requireRole("admin", "mesero"), tableRoutes);

// Admin, mesero y cocinero: pedidos
app.use("/api/orders", authMiddleware, orderRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API Restaurante funcionando",
    endpoints: {
      auth: "/api/auth",
      products: "/api/products",
      tables: "/api/tables",
      orders: "/api/orders",
    },
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
