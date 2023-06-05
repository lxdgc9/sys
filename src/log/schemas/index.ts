import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { Schema, Types } from "mongoose";

interface ILog {
  actor: Types.ObjectId;
  act: Actions;
  doc: any;
}

export const schema = new Schema<ILog>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "actor",
    },
    act: {
      type: String,
      enum: Actions,
      required: true,
    },
    doc: {
      type: Schema.Types.Mixed,
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
