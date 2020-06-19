const mongoose = require("mongoose");

const schema = mongoose.Schema({
  user: String,
  code: String,
  date: Number
});

module.exports = mongoose.model("verify", schema);