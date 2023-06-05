import { Schema, Types } from "mongoose";

export interface IActor {
  uid: Types.ObjectId;
  doc: any;
}

export const schema = new Schema<IActor>(
  {
    uid: {
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
