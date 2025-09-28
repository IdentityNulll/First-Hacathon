const express = require("express");
const { register, login, getUserById, verify, updateUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getUserById);
router.get("/verify", authMiddleware, verify); 
router.put("/user/:id", authMiddleware, updateUser);

module.exports = router;
