import { Schema, Types, model } from "mongoose";

interface ICourse {
  title: string;
  author: Types.ObjectId;
  content: string;
  lessons: Types.ObjectId[];
  classes: Types.ObjectId[];
  is_publish: boolean;
  comments: Types.ObjectId[];
  ratings: Types.ObjectId[];
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
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Course = model<ICourse>("course", schema);
