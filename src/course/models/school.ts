import mongoose, { Schema, Types } from "mongoose";

interface ISchool {
  code: string;
  name: string;
  info: string;
  logo: string;
  classes: Types.ObjectId[];
  members: Types.ObjectId[];
}

const schema = new Schema<ISchool>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    info: {
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
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
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
