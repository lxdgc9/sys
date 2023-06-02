import { Schema, Types, model } from "mongoose";
import { timer } from "../helper/timer";
import { School } from "./school";
import { User } from "./user";

interface IClass {
  name: string;
  school: Types.ObjectId;
  members: Types.ObjectId[];
}

const schema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
    },
    school: {
      type: Schema.Types.ObjectId,
      ref: "school",
      required: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
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

schema.pre(
  "deleteOne",
  {
    query: false,
    document: true,
  },
  async function (next) {
    console.group("Hook class.deleteOne");
    const breakPoint01 = timer.breakPoint();
    try {
      await Promise.all([
        User.updateMany(
          {
            _id: {
              $in: this.members,
            },
          },
          {
            $pull: {
              classes: this._id,
            },
          }
        ),
        School.findByIdAndUpdate(this.school, {
          $pull: {
            classes: this._id,
          },
        }),
      ]);
    } catch (e) {
      console.log(e);
    }
    timer.cal("Total", breakPoint01);
    console.groupEnd();
    next();
  }
);

schema.pre("deleteMany", { query: true }, async function (next) {
  console.group("Hook class.deleteMany");
  const breakPoint01 = timer.breakPoint();
  try {
  } catch (e) {
    console.log(e);
  }
  timer.cal("Total", breakPoint01);
  console.groupEnd();
  next();
});

export const Class = model<IClass>("class", schema);
