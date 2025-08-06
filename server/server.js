const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // if you're using .env

const app = express();
app.use(cors());
app.use(express.json()); // 🔥 allows Express to read JSON bodies

// 🔁 API Route for swipes
app.use('/api/swipes', require('./routes/swipes'));
app.use('/api/home-swipes', require('./routes/homeSwipes'));


// MongoDB connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/matchengine", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB error:", err));

// 🔌 Real-time chat server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("send_message", (data) => {
    console.log("📨 Message:", data);
    io.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
