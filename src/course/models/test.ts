import mongoose, { Schema, Types } from "mongoose";

interface ITest {
  title: string;
  password: string;
  created_by: Types.ObjectId;
  duration: number;
  started_at: Date;
  is_publish: boolean;
  for_classes: Types.ObjectId[];
  questions: {
    content: string;
    answers: {
      content: string;
      is_correct: boolean;
    }[];
  };
}

const schema = new Schema<ITest>(
  {
    title: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    duration: {
      type: Number,
      min: 0,
      default: 60,
    },
    started_at: {
      type: Date,
      default: Date.now(),
    },
    is_publish: {
      type: Boolean,
      default: false,
    },
    for_classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
    ],
    questions: [
      {
        content: {
          type: String,
          requried: true,
        },
        answers: [
          {
            content: {
              type: String,
              required: true,
            },
            is_correct: {
              type: Boolean,
              default: false,
            },
          },
        ],
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

export const Test = mongoose.model<ITest>("test", schema);
