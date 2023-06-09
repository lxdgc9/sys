import { Types } from "mongoose";
import { Subject } from "./subject";

export interface Log {
  subject: Subject.LOG;
  data: {
    user_id?: Types.ObjectId;
    model: string;
    action: "insert" | "update" | "delete";
    doc: any;
  };
}
