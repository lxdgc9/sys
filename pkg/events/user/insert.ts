import { Types } from "mongoose";
import { Subject } from "../subject";

export interface InsertUser {
  subject: Subject.INSERT_USER;
  data: {
    id: Types.ObjectId;
    attrs: {
      k: string;
      v: string;
    }[];
    role: string;
    is_active: boolean;
  };
}
