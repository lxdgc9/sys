import { Schema, Types, model } from "mongoose";

interface IRating {
  user: Types.ObjectId;
  level: number;
}

const schema = new Schema<IRating>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    level: {
      type: Number,
      min: 0,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Rating = model<IRating>("rating", schema);
