import { Types } from "mongoose";
import { Subject } from "../subject";

export interface UpdateUser {
  subject: Subject.UPDATE_USER;
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
