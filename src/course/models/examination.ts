import mongoose, { Schema, Types } from "mongoose";

interface IExamination {
  title: string;
  course: Types.ObjectId;
  created_by: Types.ObjectId;
  duration: number;
  code: string;
  type: "choice" | "essay" | "combine";
  questions: Types.ObjectId[];
}

const schema = new Schema<IExamination>(
  {
    title: {
      type: String,
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "course",
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    duration: {
      type: Number,
      default: 0,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["choice", "essay", "combine"],
      required: true,
    },
    questions: [
      {
        type: Schema.Types.ObjectId,
        ref: "question",
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

export const Exam = mongoose.model<IExamination>("exam", schema);
