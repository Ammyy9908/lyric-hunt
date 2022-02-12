const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./utils/connect_db");
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

if (connectDB()) {
  console.log("MongoDB connected");
} else {
  console.log("MongoDB connection failed");
}

app.listen(port, () => console.log(`Listening on port ${port}`));
