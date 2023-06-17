import mongoose, { Schema, Types } from "mongoose";

interface ILesson {
  course_id: Types.ObjectId;
  title: string;
  content: string;
  files: {
    path: string;
    filename: string;
    mime_type: string;
  }[];
}

const schema = new Schema<ILesson>(
  {
    course_id: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    files: [
      {
        path: {
          type: String,
        },
        filename: {
          type: String,
        },
        mime_type: {
          type: String,
        },
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

export const Lesson = mongoose.model<ILesson>("lesson", schema);
