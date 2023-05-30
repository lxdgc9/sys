import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { Schema, Types } from "mongoose";

interface ILog {
  actor: Types.ObjectId; // chủ thể (người thực hiện)
  act: Actions; // hành động
  doc: any;
}

export const schema = new Schema<ILog>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "user",
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
