import mongoose, { Schema, Types } from "mongoose";

interface IUser {
  user_id: Types.ObjectId;
  data: any;
  schools: Types.ObjectId[];
  classes: Types.ObjectId[];
  courses: {
    course: Types.ObjectId;
    process: number;
  }[];
  created_courses: Types.ObjectId[];
}

const schema = new Schema<IUser>(
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
    schools: [
      {
        type: Schema.Types.ObjectId,
        ref: "school",
      },
    ],
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    courses: [
      {
        course: {
          type: Schema.Types.ObjectId,
          ref: "course",
        },
        process: {
          type: Number,
          min: 0,
          default: 0,
        },
      },
    ],
    created_courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "course",
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

export const User = mongoose.model<IUser>("user", schema);
