const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Category = mongoose.model("type", categorySchema);

module.exports = Category;
