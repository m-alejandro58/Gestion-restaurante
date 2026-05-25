const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo productos"
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;

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

const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

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
  deleteProduct
};