const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/restaurante";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["admin", "mesero", "cocinero"] },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

const users = [
  { name: "Administrador",  email: "admin@restaurante.com",   password: "admin123",   role: "admin" },
  { name: "María Mesera",   email: "mesero@restaurante.com",  password: "mesero123",  role: "mesero" },
  { name: "Carlos Cocinero",email: "cocina@restaurante.com",  password: "cocina123",  role: "cocinero" },
];

async function seedUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Conectado a MongoDB");

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`  Usuario ${u.email} ya existe — omitido`);
        continue;
      }
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashed });
      console.log(`  Creado: ${u.name} (${u.role})`);
    }

    console.log("\nUsuarios por defecto:");
    console.log("  admin@restaurante.com   / admin123   → Admin");
    console.log("  mesero@restaurante.com  / mesero123  → Mesero");
    console.log("  cocina@restaurante.com  / cocina123  → Cocinero");
  } catch (err) {
    console.error("Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedUsers();
