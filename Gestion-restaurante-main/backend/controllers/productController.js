const Product = require("../models/Product");
const Order = require("../models/Order");

const getProducts = async (req, res) => {
  try {

    const { category, search } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    const products = await Product.find(filter);

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: "Error obteniendo productos"
    });

  }
};

const createProduct = async (req, res) => {
  try {

    const {
      name,
      price,
      category,
      stock
    } = req.body;

    if (
      !name.trim() ||
      price <= 0 ||
      stock < 0
    ) {
      return res.status(400).json({
        message: "Datos inválidos"
      });
    }

    const product = new Product({
      name,
      price,
      category,
      stock
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {

    res.status(500).json({
      message: "Error creando producto"
    });

  }
};

const updateProduct = async (req, res) => {
  try {

    if (req.body.price <= 0) {
      return res.status(400).json({
        message: "Precio inválido"
      });
    }

    if (req.body.stock < 0) {
      return res.status(400).json({
        message: "Stock inválido"
      });
    }

    const updatedProduct =
      await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          returnDocument: "after"
        }
      );

    res.json(updatedProduct);

  } catch (error) {

    res.status(500).json({
      message: "Error actualizando producto"
    });

  }
};

const deleteProduct = async (req, res) => {
  try {

    const existingOrder = await Order.findOne({
      "items.product": req.params.id
    });

    if (existingOrder) {
      return res.status(400).json({
        message:
          "No se puede eliminar un producto asociado a pedidos"
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Producto eliminado"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error eliminando producto"
    });

  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};