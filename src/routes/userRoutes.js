const express = require("express");
const router = express.Router();
const profileController = require("../controllers/userController");

// Auth
router.post("/register", profileController.register);
router.post("/login", profileController.login);

// Users
router.get("/:id", profileController.getUserById);

module.exports = router;
