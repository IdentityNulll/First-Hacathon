const Product = require("../modules/productsModule");

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params; // product id
    const { userId, text } = req.body;

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const comment = { user: userId, text, createdAt: new Date() };
    product.comments.push(comment);
    await product.save();

    // Emit socket event
    const io = req.app.get("io");
    io.emit("newComment", { productId: id, comment });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all comments for a product
exports.getComments = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("comments.user", "firstName lastName email")
      .select("comments");

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product.comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

