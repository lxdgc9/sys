import mongoose, { Schema, Types } from "mongoose";

interface ICmt {
  user: Types.ObjectId;
  time_point?: number;
  body: string;
  repl_id?: Types.ObjectId;
}

const schema = new Schema<ICmt>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    time_point: {
      type: Number,
    },
    body: {
      type: String,
      required: true,
    },
    repl_id: {
      type: Schema.Types.ObjectId,
      ref: "comment",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const Comment = mongoose.model<ICmt>("comment", schema);
