const Order = require("../models/Order");
const Product = require("../models/Product");
const Table = require("../models/Table");

const getOrders = async (req, res) => {
  try {

    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    const orders = await Order.find(filter)
      .populate("table", "number location")
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Error obteniendo pedidos"
    });

  }
};

const getOrderById = async (req, res) => {
  try {

    const order = await Order.findById(
      req.params.id
    )
      .populate("table", "number location")
      .populate("items.product", "name price category");

    if (!order) {
      return res.status(404).json({
        message: "Pedido no encontrado"
      });
    }

    res.json(order);

  } catch (error) {

    res.status(500).json({
      message: "Error obteniendo pedido"
    });

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
      return res.status(404).json({
        message: "Mesa no encontrada"
      });
    }

    // VALIDAR MESA OCUPADA
    if (tableExists.status === "occupied") {
      return res.status(400).json({
        message: "La mesa ya está ocupada"
      });
    }

    let total = 0;

    const resolvedItems = [];

    // VALIDAR PRODUCTOS
    for (const item of items) {

      if (item.quantity <= 0) {
        return res.status(400).json({
          message: "Cantidad inválida"
        });
      }

      const product = await Product.findById(
        item.product
      );

      if (!product) {
        return res.status(404).json({
          message: `Producto no encontrado`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Stock insuficiente para ${product.name}`
        });
      }

      resolvedItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price
      });

      total += product.price * item.quantity;
    }

    // DESCONTAR STOCK
    for (const item of items) {

      const product = await Product.findById(
        item.product
      );

      product.stock -= item.quantity;

      await product.save();

    }

    // CREAR ORDEN
    const order = new Order({
      table,
      items: resolvedItems,
      total,
      notes
    });

    const savedOrder = await order.save();

    // OCUPAR MESA
    await Table.findByIdAndUpdate(
      table,
      { status: "occupied" }
    );

    const populated = await Order.findById(
      savedOrder._id
    )
      .populate("table", "number location")
      .populate("items.product", "name price");

    res.status(201).json(populated);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error creando pedido"
    });

  }
};

const updateOrder = async (req, res) => {
  try {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Pedido no encontrado"
      });
    }

    // NO CANCELAR ENTREGADOS
    if (
      order.status === "delivered" &&
      req.body.status === "cancelled"
    ) {
      return res.status(400).json({
        message: "No se puede cancelar un pedido entregado"
      });
    }

    // DEVOLVER STOCK
    if (
      req.body.status === "cancelled" &&
      order.status !== "cancelled"
    ) {

      for (const item of order.items) {

        const product = await Product.findById(
          item.product
        );

        if (product) {

          product.stock += item.quantity;

          await product.save();

        }
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after"
      }
    )
      .populate("table", "number location")
      .populate("items.product", "name price");

    // LIBERAR MESA
    if (
      req.body.status === "delivered" ||
      req.body.status === "cancelled"
    ) {

      await Table.findByIdAndUpdate(
        order.table,
        { status: "available" }
      );
    }

    res.json(updatedOrder);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error actualizando pedido"
    });

  }
};

const deleteOrder = async (req, res) => {
  try {

    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Pedido no encontrado"
      });
    }

    // DEVOLVER STOCK
    for (const item of order.items) {

      const product = await Product.findById(
        item.product
      );

      if (product) {

        product.stock += item.quantity;

        await product.save();

      }
    }

    // LIBERAR MESA
    await Table.findByIdAndUpdate(
      order.table,
      { status: "available" }
    );

    // ELIMINAR PEDIDO
    await Order.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Pedido eliminado"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error eliminando pedido"
    });

  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};