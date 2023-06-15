import mongoose, { Schema, Types } from "mongoose";

interface ICatalog {
  name: string;
  rules: Types.ObjectId[];
}

const schema = new Schema<ICatalog>({
  name: {
    type: String,
    required: true,
  },
  rules: [
    {
      type: Schema.Types.ObjectId,
      ref: "rule",
    },
  ],
});

export const Catalog = mongoose.model<ICatalog>("catalog", schema);
