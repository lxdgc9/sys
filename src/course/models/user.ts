import mongoose, { Schema, Types } from "mongoose";

interface IUser {
  user_id: Types.ObjectId;
  attrs: {
    k: string;
    v: string;
  }[];
  role: string;
  rules: string[];
  is_active: boolean;
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
    attrs: [
      {
        k: {
          type: String,
        },
        v: {
          type: String,
        },
      },
    ],
    role: {
      type: String,
      required: true,
    },
    rules: [
      {
        type: String,
      },
    ],
    is_active: {
      type: Boolean,
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
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        ret.prof = {};
        ret.attrs.forEach(
          ({ k, v }: { k: string; v: string }) => (ret.prof[k] = v)
        );
      },
    },
  }
);

export const User = mongoose.model<IUser>("user", schema);
