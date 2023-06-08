import { Schema, Types, model } from "mongoose";

interface IUser {
  uid: Types.ObjectId;
  payload: any;
  classes: Types.ObjectId[];
  schools: Types.ObjectId[];
  courses: {
    course_id: Types.ObjectId;
    process: number;
  }[];
}

const schema = new Schema<IUser>(
  {
    uid: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    schools: [
      {
        type: Schema.Types.ObjectId,
        ref: "school",
      },
    ],
    courses: [
      {
        course_id: {
          type: Schema.Types.ObjectId,
          ref: "course",
        },
        process: {
          type: Number,
          min: 0,
        },
      },
    ],
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

export const User = model<IUser>("user", schema);
