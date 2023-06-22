import mongoose, { Schema, Types } from "mongoose";

interface IQuestion {
  content: string;
  course: Types.ObjectId;
  created_by: Types.ObjectId;
  type: "choice" | "essay";
  difficult: number;
  has_many_ans: boolean;
  answers:
    | {
        content: string;
        is_correct: boolean;
      }[]
    | string;
}

const schema = new Schema<IQuestion>({
  content: {
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
  type: {
    type: String,
    enum: ["choice", "essay"],
    required: true,
  },
  difficult: {
    type: Number,
    required: true,
  },
  has_many_ans: {
    type: Boolean,
    required: true,
  },
  answers: {
    type: Schema.Types.Mixed,
    requried: true,
  },
});

export const Question = mongoose.model<IQuestion>("question", schema);
