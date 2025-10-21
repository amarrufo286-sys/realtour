const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/realtour"; // local DB

function connectDB() {
  mongoose.set("strictQuery", true);
  return mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = connectDB;
