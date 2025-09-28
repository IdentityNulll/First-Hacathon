const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ratingHistorySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    value: { type: Number, min: 1, max: 5, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const historySchema = new mongoose.Schema(
  {
    action: { type: String }, // e.g. "invested", "updated", "withdrawn"
    amount: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,

    balance: {
      defaultBalance: { type: Number, default: 0 },
      activeBalance: { type: Number, default: 0 },
      amountBalance: { type: Number, default: 0 },
    },

    invested: { type: Number, default: 0 },
    requirement: { type: Number, default: 0 }, // how much required
    profit: { type: Number, default: 0 },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    history: [historySchema],
    comments: [commentSchema],

    rating: { type: Number, default: 0 }, // avg rating
    ratingHistory: [ratingHistorySchema],

    category: { type: String, required: true },

    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
