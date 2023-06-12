import { Schema, Types, model } from "mongoose";

interface ISchool {
  code: string;
  name: string;
  addr?: string;
  desc?: string;
  logo?: string;
  classes: Types.ObjectId[];
}

const schema = new Schema<ISchool>(
  {
    code: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    addr: {
      type: String,
    },
    desc: {
      type: String,
    },
    logo: {
      type: String,
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "class",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const School = model<ISchool>("school", schema);
