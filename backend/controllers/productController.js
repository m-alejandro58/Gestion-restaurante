const Product = require("../models/Product");
 
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
 
    const filter = {};
 
    if (category) {
      filter.category = category;
    }
 
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }
 
    const products = await Product.find(filter);
 
    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo productos"
    });
  }
};
 
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
 
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }
 
    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo producto"
    });
  }
};
 
const createProduct = async (req, res) => {
  try {
    const { name, price, category, stock } = req.body;
 
    if (!name || !price || !category || stock === undefined) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios"
      });
    }
 
    if (price <= 0) {
      return res.status(400).json({
        message: "El precio debe ser mayor a 0"
      });
    }
 
    if (stock < 0) {
      return res.status(400).json({
        message: "El stock no puede ser negativo"
      });
    }
 
    const product = new Product({ name, price, category, stock });
 
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
    const product = await Product.findById(req.params.id);
 
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }
 
    const { price, stock } = req.body;
 
    if (price !== undefined && price <= 0) {
      return res.status(400).json({
        message: "El precio debe ser mayor a 0"
      });
    }
 
    if (stock !== undefined && stock < 0) {
      return res.status(400).json({
        message: "El stock no puede ser negativo"
      });
    }
 
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
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
    const product = await Product.findById(req.params.id);
 
    if (!product) {
      return res.status(404).json({
        message: "Producto no encontrado"
      });
    }
 
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
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
