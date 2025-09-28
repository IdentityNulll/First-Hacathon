const express = require("express");
const router = express.Router();
const productController = require("../controllers/productsController");

// Comments
router.post("/:id/comments", productController.addComment);
router.get("/:id/comments", productController.getComments);

// Products
router.get("/", productController.getAllProducts);
router.get("/user/:userId", productController.getProductsByUserId);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.post("/", productController.createProduct)

module.exports = router;