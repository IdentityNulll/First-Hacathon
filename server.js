const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
const profileRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes"); // ✅ new
app.use("/api/users", profileRoutes);
app.use("/api/products", productRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

// Make io accessible in controllers
app.set("io", io);

server.listen(5000, () => console.log("Server running on port 5000"));
