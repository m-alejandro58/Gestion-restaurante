const Order = require("../models/Order");
const Product = require("../models/Product");
const Table = require("../models/Table");
 
const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
 
    const filter = {};
 
    if (status) filter.status = status;
 
    const orders = await Order.find(filter)
      .populate("table", "number location")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });
 
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo pedidos" });
  }
};
 
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("table", "number location")
      .populate("items.product", "name price category");
 
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
 
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo pedido" });
  }
};
 
const createOrder = async (req, res) => {
  try {
    const { table, items, notes } = req.body;
 
    if (!table || !items || items.length === 0) {
      return res.status(400).json({
        message: "La mesa y al menos un producto son obligatorios"
      });
    }
 
    const tableExists = await Table.findById(table);
 
    if (!tableExists) {
      return res.status(404).json({ message: "Mesa no encontrada" });
    }
 
    let total = 0;
    const resolvedItems = [];
 
    for (const item of items) {
      const product = await Product.findById(item.product);
 
      if (!product) {
        return res.status(404).json({
          message: `Producto no encontrado: ${item.product}`
        });
      }
 
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para: ${product.name}`
        });
      }
 
      resolvedItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price
      });
 
      total += product.price * item.quantity;
    }
 
    const order = new Order({ table, items: resolvedItems, total, notes });
    const savedOrder = await order.save();
 
    await Table.findByIdAndUpdate(table, { status: "occupied" });
 
    const populated = await Order.findById(savedOrder._id)
      .populate("table", "number location")
      .populate("items.product", "name price");
 
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Error creando pedido" });
  }
};
 
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
 
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
 
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
      .populate("table", "number location")
      .populate("items.product", "name price");
 
    if (
      req.body.status === "delivered" ||
      req.body.status === "cancelled"
    ) {
      await Table.findByIdAndUpdate(order.table, { status: "available" });
    }
 
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error actualizando pedido" });
  }
};
 
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
 
    if (!order) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
 
    await Order.findByIdAndDelete(req.params.id);
 
    res.json({ message: "Pedido eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error eliminando pedido" });
  }
};
 
module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};
