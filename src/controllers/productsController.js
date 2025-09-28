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

// 🔹 Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get products by user ID
exports.getProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const products = await Product.find({ user: userId }).sort({
      createdAt: -1,
    });

    if (!products.length)
      return res
        .status(404)
        .json({ message: "No products found for this user" });

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Update product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      requirement,
      profit,
      category,
      creator, // userId who created it
    } = req.body;

    const newProduct = new Product({
      name,
      description,
      requirement,
      profit,
      category,
      creator,
      balance: {
        defaultBalance: 0,
        activeBalance: 0,
        amountBalance: 0,
      },
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
