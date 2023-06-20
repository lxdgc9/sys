import mongoose, { Schema, Types } from "mongoose";

interface ITestClass {
  test: Types.ObjectId;
  classes: Types.ObjectId[];
}

const schema = new Schema<ITestClass>(
  {
    test: {
      type: Schema.Types.ObjectId,
      ref: "test",
      required: true,
    },
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "class",
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

export const TestClass = mongoose.model<ITestClass>("test-class", schema);
