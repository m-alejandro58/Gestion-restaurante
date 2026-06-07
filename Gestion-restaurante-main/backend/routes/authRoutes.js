const express = require("express");
const router = express.Router();
const { login, getMe, register, getUsers, deleteUser } = require("../controllers/authController");
const { authMiddleware, requireRole } = require("../middleware/auth");

router.post("/login", login);
router.get("/me", authMiddleware, getMe);

// Solo admin
router.post("/register", authMiddleware, requireRole("admin"), register);
router.get("/users", authMiddleware, requireRole("admin"), getUsers);
router.delete("/users/:id", authMiddleware, requireRole("admin"), deleteUser);

module.exports = router;
