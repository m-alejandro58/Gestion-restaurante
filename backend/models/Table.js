const mongoose = require("mongoose");
 
const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true
    },
 
    capacity: {
      type: Number,
      required: true
    },
 
    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available"
    },
 
    location: {
      type: String,
      enum: ["interior", "exterior", "bar"],
      default: "interior"
    }
  },
  {
    timestamps: true
  }
);
 
module.exports = mongoose.model("Table", tableSchema);