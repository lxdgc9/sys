import mongoose, { Schema, Types } from "mongoose";

interface IClass {
  name: string;
  school: Types.ObjectId;
  members: Types.ObjectId[];
}

const schema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "school",
      required: true,
    },
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

export const Class = mongoose.model<IClass>("class", schema);
