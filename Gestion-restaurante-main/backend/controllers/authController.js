const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = require("../middleware/auth");

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email y contraseña requeridos" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.active) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "8h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// GET /api/auth/me  (verificar sesión activa)
const getMe = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// POST /api/auth/register  (solo admin puede crear usuarios)
const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Nombre, email y contraseña requeridos" });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    const user = await User.create({ name, email, password, role: role || "mesero" });

    res.status(201).json({
      message: "Usuario creado",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Error al crear usuario" });
  }
};

// GET /api/auth/users  (solo admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// DELETE /api/auth/users/:id  (solo admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario desactivado" });
  } catch (err) {
    res.status(500).json({ message: "Error al desactivar usuario" });
  }
};

module.exports = { login, getMe, register, getUsers, deleteUser };
