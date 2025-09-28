const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");

// Comments
router.post("/:id/comments", productController.addComment);
router.get("/:id/comments", productController.getComments);

module.exports = router;
