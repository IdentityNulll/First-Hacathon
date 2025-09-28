const express = require("express");
const { register, login, getUserById, verify } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:id", getUserById);
router.get("/verify", authMiddleware, verify); 

module.exports = router;
