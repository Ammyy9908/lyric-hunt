const { model, Schema } = require("mongoose");

const user_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  api_key: {
    type: String,
    default: "",
  },
});

const User = model("user", user_schema);
module.exports = User;
