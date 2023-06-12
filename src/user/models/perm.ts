import mongoose, { Schema, Types } from "mongoose";

interface IPerm {
  code: string;
  info: string;
  perm_group: Types.ObjectId;
}

const schema = new Schema<IPerm>({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  info: {
    type: String,
    required: true,
  },
  perm_group: {
    type: Schema.Types.ObjectId,
    ref: "perm_group",
    required: true,
  },
});

export const Perm = mongoose.model<IPerm>("perm", schema);
