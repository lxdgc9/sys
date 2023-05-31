import { Schema, Types } from "mongoose";

export interface IActor {
  userId: Types.ObjectId;
  doc: any;
}

export const schema = new Schema<IActor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    doc: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);
