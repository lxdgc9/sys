import { genSalt, hash } from "bcryptjs";
import { Schema, Types, model } from "mongoose";
import { promisify } from "util";

interface IUser {
  attrs: {
    k: string;
    v: string;
  }[];
  passwd: string;
  role: Types.ObjectId;
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
    passwd: {
      type: String,
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
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
    toJSON: {
      virtuals: true,
      transform(_doc, ret, _opts) {
        ret.prof = {};
        ret.attrs.forEach(
          ({ k, v }: { k: string; v: string }) => (ret.prof[k] = v)
        );

        delete ret._id;
        delete ret.attrs;
        delete ret.passwd;
        delete ret.__v;
      },
    },
  }
);

schema.index({
  "attrs.k": 1,
  "attrs.v": 1,
});

schema.pre("save", async function (next) {
  if (!this.isModified("passwd")) {
    return next();
  }

  try {
    const salt = await genSalt(10);
    this.passwd = await promisify(hash)(this.passwd, salt);
    next();
  } catch (e) {
    console.log(e);
  }
});

schema.pre("insertMany", async function (next, docs) {
  try {
    const salt = await genSalt(10);
    const hashPromises = docs.map((user: { passwd: string }) => {
      promisify(hash)(user.passwd, salt);
    });
    const hashedPasswords = await Promise.all(hashPromises);

    docs.forEach((user: { passwd: string }, index: number) => {
      user.passwd = hashedPasswords[index];
    });
    next();
  } catch (e) {
    console.log(e);
  }
});

export const User = model<IUser>("user", schema);
