import mongoose from "mongoose";

interface ISubmission {}

const schema = new mongoose.Schema<ISubmission>({});

export const Submission = mongoose.model<ISubmission>("submission", schema);
