const mongoose = require("mongoose");

const val = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("content", val);
