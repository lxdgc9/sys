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
  }
);

export const Rating = model<IRating>("rating", schema);
