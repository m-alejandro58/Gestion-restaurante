const mongoose = require("mongoose");
 
const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
 
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
 
  unitPrice: {
    type: Number,
    required: true
  }
});
 
const orderSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true
    },
 
    items: {
      type: [orderItemSchema],
      required: true
    },
 
    status: {
      type: String,
      enum: ["pending", "in_progress", "ready", "delivered", "cancelled"],
      default: "pending"
    },
 
    total: {
      type: Number,
      required: true
    },
 
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);
 
module.exports = mongoose.model("Order", orderSchema);