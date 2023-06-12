import mongoose, { Schema, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
  attrs: {
    k: string;
    v: string;
  }[];
  password: string;
  role: Types.ObjectId;
  spec_perms: Types.ObjectId[];
  is_active: boolean;
}

const schema = new Schema<IUser>(
  {
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
    spec_perms: [
      {
        type: Schema.Types.ObjectId,
        ref: "perm",
      },
    ],
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

schema.index({
  "attrs.k": 1,
  "attrs.v": 1,
});

schema.pre("save", async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (e) {
    console.log(e);
  }
});

schema.pre("insertMany", async function(next, users: IUser[]) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPwds = await Promise.all(
      users.map((user) => bcrypt.hash(user.password, salt))
    );

    users.forEach((user, idx) => {
      user.password = hashedPwds[idx];
    });
    next();
  } catch (e) {
    console.log(e);
  }
});

export const User = mongoose.model<IUser>("user", schema);
