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
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const Type = mongoose.model("category", typeSchema);

module.exports = Type;
