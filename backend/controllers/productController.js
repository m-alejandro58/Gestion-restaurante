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

module.exports = {
  getProducts,
  createProduct
};