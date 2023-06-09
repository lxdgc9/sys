import { Schema, Types, model } from "mongoose";

interface IPerm {
  code: string;
  info: string;
  perm_set: Types.ObjectId;
}

const schema = new Schema<IPerm>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    info: {
      type: String,
      required: true,
    },
    perm_set: {
      type: Schema.Types.ObjectId,
      ref: "perm_set",
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

export const Perm = model<IPerm>("perm", schema);
