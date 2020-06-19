const mongoose = require("mongoose");

const schema = mongoose.Schema({
  owner: String,
  bot: String,
  invite: String,
  permissions: Object,
  prefix: String,
  helpCommand: String
});

module.exports = mongoose.model("bot", schema);