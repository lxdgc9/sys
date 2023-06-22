const mongoose = require("mongoose");

const typeSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Product = mongoose.model("product", typeSchema);

module.exports = Product;
