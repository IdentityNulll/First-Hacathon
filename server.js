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


const profileRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes"); 
app.use("/api/users", profileRoutes);
app.use("/api/products", productRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});


app.set("io", io);

server.listen(process.env.PORT, () => console.log("Server running on port"));