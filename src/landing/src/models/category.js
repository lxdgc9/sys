const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
);

const Category = mongoose.model("category", categorySchema);

module.exports = Category;
