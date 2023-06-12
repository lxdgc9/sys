import mongoose, { Schema, Types } from "mongoose";

interface IRole {
  name: string;
  level: number;
  perms: Types.ObjectId[];
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
  perms: [
    {
      type: Schema.Types.ObjectId,
      ref: "perm",
    },
  ],
});

export const Role = mongoose.model<IRole>("role", schema);
