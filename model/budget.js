const mongoose = require("mongoose");
const val = new mongoose.Schema(
  {
    budget: Number,
  },
);
module.exports = mongoose.model("budget", val);
