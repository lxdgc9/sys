import mongoose, { Schema, Types } from "mongoose";

interface ICourse {
  title: string;
  author: Types.ObjectId;
  content: string;
  lessons: Types.ObjectId[];
  classes: Types.ObjectId[];
  is_publish: boolean;
  comments: Types.ObjectId[];
  ratings: Types.ObjectId[];
  same_authors: Types.ObjectId[];
}

const schema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    lessons: [
      {
        type: Schema.Types.ObjectId,
        ref: "lesson",
      },
    ],
    is_publish: {
      type: Boolean,
      default: false,
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "class",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "comment",
      },
    ],
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: "rating",
      },
    ],
    same_authors: [
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

export const Course = mongoose.model<ICourse>("course", schema);
