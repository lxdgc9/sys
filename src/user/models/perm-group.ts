import { Schema, Types, model } from "mongoose";

interface IPermGroup {
  name: string;
  items: Types.ObjectId[];
}

const schema = new Schema<IPermGroup>({
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
});

export const PermGroup = model<IPermGroup>("perm_group", schema);
