const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

const user = new mongoose.Schema(
  {
    budget: {
      type: Number,
      default: 0,
    },
    username: String,
    password: String,
    email: String,
    token: {
      type: Number,
      default: -1,
    },
    expenses: [{ type: mongoose.Schema.Types.ObjectId, ref: "content" }],
  },
  {
    timestamps: true,
  }
);
user.plugin(plm);
module.exports = mongoose.model("user", user);
