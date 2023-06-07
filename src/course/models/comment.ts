import { Schema, Types, model } from "mongoose";

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
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Comment = model<ICmt>("comment", schema);
