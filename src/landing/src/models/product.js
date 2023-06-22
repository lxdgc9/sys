const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    types: [
      {
        type: String,
        required: true,
      },
    ],
    thumb_url: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image_urls: [
      {
        type: String,
      },
    ],
    price: {
      type: String,
      required: true,
    },
    price_sale: {
      type: String,
    },
    taxes: {
      type: Number,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
