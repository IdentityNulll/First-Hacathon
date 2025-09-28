const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const profileRoutes = require("./src/routes/userRoutes");
app.use("/api/users", profileRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.listen(5000, () => console.log("Server running on port 5000"));
