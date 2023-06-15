import mongoose, { Schema, Types } from "mongoose";

interface ISchool {
  code: string;
  name: string;
  info: string;
  logo: string;
  classes: Types.ObjectId[];
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
    info: String,
    logo: String,
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
