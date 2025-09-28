const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Profile = require("../modules/userModule");

exports.verify = async (req, res) => {
  try {
    const user = await Profile.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ valid: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await Profile.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profile = new Profile({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await profile.save();

    res.status(201).json({
      message: "User registered successfully",
      id: profile._id, // use "id" instead of "userId"
      email: profile.email,
      firstName: profile.firstName,
      lastName: profile.lastName,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Profile.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, firstName: user.firstName },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Profile.findById(id).select("-password"); // hide password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Only allow safe fields
    const allowedFields = ["firstName", "lastName", "email", "phone", "avatar"];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    updates.updatedAt = new Date();

    const user = await Profile.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
