const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Product = require("../models/Product");
const Table = require("../models/Table");
const Order = require("../models/Order");

const products = [
  { name: "Bandeja Paisa", price: 28000, category: "Platos fuertes", stock: 20 },
  { name: "Ajiaco Santafereño", price: 22000, category: "Sopas", stock: 15 },
  { name: "Arepa con Queso", price: 8000, category: "Entradas", stock: 30 },
  { name: "Empanadas (x3)", price: 10000, category: "Entradas", stock: 25 },
  { name: "Arroz con Pollo", price: 24000, category: "Platos fuertes", stock: 18 },
  { name: "Sancocho de Gallina", price: 26000, category: "Sopas", stock: 12 },
  { name: "Filete de Res", price: 38000, category: "Platos fuertes", stock: 10 },
  { name: "Trucha al Ajillo", price: 32000, category: "Platos fuertes", stock: 8 },
  { name: "Jugo de Lulo", price: 6000, category: "Bebidas", stock: 40 },
  { name: "Jugo de Maracuyá", price: 6000, category: "Bebidas", stock: 35 },
  { name: "Gaseosa 400ml", price: 4000, category: "Bebidas", stock: 50 },
  { name: "Agua Mineral", price: 3000, category: "Bebidas", stock: 60 },
  { name: "Café Tinto", price: 3000, category: "Bebidas", stock: 5 },
  { name: "Flan de Caramelo", price: 9000, category: "Postres", stock: 14 },
  { name: "Tres Leches", price: 11000, category: "Postres", stock: 0 },
  { name: "Mousse de Maracuyá", price: 10000, category: "Postres", stock: 3 },
];

const tables = [
  { number: 1, capacity: 2, status: "available", location: "interior" },
  { number: 2, capacity: 4, status: "available", location: "interior" },
  { number: 3, capacity: 4, status: "occupied",  location: "interior" },
  { number: 4, capacity: 6, status: "available", location: "interior" },
  { number: 5, capacity: 2, status: "reserved",  location: "exterior" },
  { number: 6, capacity: 4, status: "available", location: "exterior" },
  { number: 7, capacity: 6, status: "occupied",  location: "exterior" },
  { number: 8, capacity: 4, status: "available", location: "bar" },
  { number: 9, capacity: 2, status: "available", location: "bar" },
  { number: 10, capacity: 8, status: "available", location: "exterior" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado");

    await Product.deleteMany({});
    await Table.deleteMany({});
    await Order.deleteMany({});
    console.log("Colecciones limpiadas");

    const savedProducts = await Product.insertMany(products);
    console.log(`${savedProducts.length} productos insertados`);

    const savedTables = await Table.insertMany(tables);
    console.log(`${savedTables.length} mesas insertadas`);

    const orders = [
      {
        table: savedTables[2]._id,
        items: [
          { product: savedProducts[0]._id, quantity: 2, unitPrice: savedProducts[0].price },
          { product: savedProducts[8]._id, quantity: 2, unitPrice: savedProducts[8].price },
        ],
        total: savedProducts[0].price * 2 + savedProducts[8].price * 2,
        status: "in_progress",
        notes: "Sin picante"
      },
      {
        table: savedTables[6]._id,
        items: [
          { product: savedProducts[4]._id, quantity: 1, unitPrice: savedProducts[4].price },
          { product: savedProducts[13]._id, quantity: 1, unitPrice: savedProducts[13].price },
          { product: savedProducts[10]._id, quantity: 2, unitPrice: savedProducts[10].price },
        ],
        total: savedProducts[4].price + savedProducts[13].price + savedProducts[10].price * 2,
        status: "pending",
        notes: ""
      },
      {
        table: savedTables[0]._id,
        items: [
          { product: savedProducts[1]._id, quantity: 2, unitPrice: savedProducts[1].price },
          { product: savedProducts[11]._id, quantity: 2, unitPrice: savedProducts[11].price },
        ],
        total: savedProducts[1].price * 2 + savedProducts[11].price * 2,
        status: "delivered",
        notes: "Para llevar"
      },
    ];

    const savedOrders = await Order.insertMany(orders);
    console.log(`${savedOrders.length} pedidos insertados`);

    console.log("\n✅ Seed completado exitosamente");
    process.exit(0);
  } catch (error) {
    console.error("Error en el seed:", error);
    process.exit(1);
  }
};

seed();
