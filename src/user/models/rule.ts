import mongoose, { Schema, Types } from "mongoose";

interface IRule {
  code: string;
  info: string;
  catalog: Types.ObjectId;
}

const schema = new Schema<IRule>({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  info: {
    type: String,
    required: true,
  },
  catalog: {
    type: Schema.Types.ObjectId,
    ref: "catalog",
    required: true,
  },
});

export const Rule = mongoose.model<IRule>("rule", schema);
