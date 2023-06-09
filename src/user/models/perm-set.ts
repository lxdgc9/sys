import { Schema, Types, model } from "mongoose";

interface IPermSet {
  name: string;
  items: Types.ObjectId[];
}

const schema = new Schema<IPermSet>(
  {
    name: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "perm",
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

export const PermSet = model<IPermSet>("perm_set", schema);
