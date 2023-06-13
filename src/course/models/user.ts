import mongoose, { Schema, Types } from "mongoose";

interface IUser {
  user_id: Types.ObjectId;
  data: any;
  classes: Types.ObjectId[];
  schools: Types.ObjectId[];
  courses: {
    course: Types.ObjectId;
    process: number;
  }[];
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
        course: {
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
  }
);

export const User = mongoose.model<IUser>("user", schema);
