import mongoose, { Schema, Types } from "mongoose";

interface IRole {
  name: string;
  level: number;
  rules: Types.ObjectId[];
}

const schema = new Schema<IRole>({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  rules: [
    {
      type: Schema.Types.ObjectId,
      ref: "rule",
    },
  ],
});

export const Role = mongoose.model<IRole>("role", schema);
