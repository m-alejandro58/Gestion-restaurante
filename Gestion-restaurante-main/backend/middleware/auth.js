const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "restaurante_secret_2024";

// Verificar token JWT
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.active) {
      return res.status(401).json({ message: "Usuario no autorizado" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

// Verificar rol(es) permitidos
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acceso denegado. Se requiere rol: ${roles.join(" o ")}`,
      });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole, JWT_SECRET };
