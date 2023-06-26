const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    publish: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "type",
      required: true,
    },
    available: {
      type: Number,
      default: 0,
    },
    priceSale: {
      type: Number,
    },
    taxes: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    sizes: [
      {
        type: Number,
      },
    ],
    inventoryType: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],
    ratings: [
      {
        name: {
          type: String,
        },
        starCount: {
          type: Number,
        },
        reviewCount: {
          type: Number,
        },
      },
    ],
    reviews: [
      {
        name: {
          type: String,
        },
        postedAt: {
          type: Date,
        },
        comment: {
          type: String,
        },
        isPurchased: {
          type: Boolean,
        },
        rating: {
          type: String,
        },
        avatarUrl: {
          type: String,
        },
        helpful: {
          type: Number,
        },
        attachments: [
          {
            type: mongoose.Schema.Types.Mixed,
          },
        ],
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    code: {
      type: String,
    },
    description: {
      type: String,
    },
    newLabel: {
      enabled: {
        type: Boolean,
      },
      content: {
        type: String,
      },
    },
    sku: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    saleLabel: {
      enabled: {
        type: Boolean,
      },
      content: {
        type: String,
      },
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
    coverUrl: {
      type: String,
    },
    totalRatings: {
      type: Number,
    },
    totalSold: {
      type: Number,
    },
    totalReviews: {
      type: Number,
    },
    subDescription: {
      type: String,
    },
    colors: [
      {
        type: String,
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

const Product = mongoose.model("product", productSchema);

module.exports = Product;
