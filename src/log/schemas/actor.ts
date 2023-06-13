import { Schema, Types } from "mongoose";

export interface IActor {
  user_id: Types.ObjectId;
  data: any;
}

const schema = new Schema<IActor>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    data: {
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

export default schema;
