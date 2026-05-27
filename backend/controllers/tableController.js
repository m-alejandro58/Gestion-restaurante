const Table = require("../models/Table");
 
const getTables = async (req, res) => {
  try {
    const { status, location } = req.query;
 
    const filter = {};
 
    if (status) filter.status = status;
    if (location) filter.location = location;
 
    const tables = await Table.find(filter).sort({ number: 1 });
 
    res.json(tables);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo mesas"
    });
  }
};
 
const getTableById = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
 
    if (!table) {
      return res.status(404).json({
        message: "Mesa no encontrada"
      });
    }
 
    res.json(table);
  } catch (error) {
    res.status(500).json({
      message: "Error obteniendo mesa"
    });
  }
};
 
const createTable = async (req, res) => {
  try {
    const { number, capacity, status, location } = req.body;
 
    if (!number || !capacity) {
      return res.status(400).json({
        message: "El número y la capacidad son obligatorios"
      });
    }
 
    if (capacity < 1) {
      return res.status(400).json({
        message: "La capacidad debe ser mayor a 0"
      });
    }
 
    const existing = await Table.findOne({ number });
 
    if (existing) {
      return res.status(400).json({
        message: "Ya existe una mesa con ese número"
      });
    }
 
    const table = new Table({ number, capacity, status, location });
 
    const savedTable = await table.save();
 
    res.status(201).json(savedTable);
  } catch (error) {
    res.status(500).json({
      message: "Error creando mesa"
    });
  }
};
 
const updateTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
 
    if (!table) {
      return res.status(404).json({
        message: "Mesa no encontrada"
      });
    }
 
    const updatedTable = await Table.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
 
    res.json(updatedTable);
  } catch (error) {
    res.status(500).json({
      message: "Error actualizando mesa"
    });
  }
};
 
const deleteTable = async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
 
    if (!table) {
      return res.status(404).json({
        message: "Mesa no encontrada"
      });
    }
 
    await Table.findByIdAndDelete(req.params.id);
 
    res.json({
      message: "Mesa eliminada"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error eliminando mesa"
    });
  }
};
 
module.exports = {
  getTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable
};
 