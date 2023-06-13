import { Schema, Types } from "mongoose";

interface ILog {
  actor: Types.ObjectId;
  action: string;
  data: any;
}

export const schema = new Schema<ILog>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "actor",
    },
    action: {
      type: String,
      required: true,
    },
    data: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
