import { Schema, Types, model } from "mongoose";

interface IPermGrp {
  name: string;
  perms: Types.ObjectId[];
}

const schema = new Schema<IPermGrp>(
  {
    name: {
      type: String,
      required: true,
    },
    perms: [
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

export const PermGrp = model<IPermGrp>("perm-grp", schema);
