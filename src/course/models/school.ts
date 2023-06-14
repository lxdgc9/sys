import mongoose, { Schema, Types } from "mongoose";

interface ISchool {
  code: string;
  name: string;
  address?: string;
  description?: string;
  logo_url?: string;
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
    address: {
      type: String,
    },
    description: {
      type: String,
    },
    logo_url: {
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

export const School = mongoose.model<ISchool>("school", schema);
