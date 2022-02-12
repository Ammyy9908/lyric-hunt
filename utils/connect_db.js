const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const connectDB = async () => {
  const connectUrl = process.env.DB_URL;
  try {
    const is_connected = await mongoose.connect(connectUrl);
    return is_connected;
  } catch (e) {
    return null;
  }
};

module.exports = connectDB;
