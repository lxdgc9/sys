import { Document } from "mongoose";
import { Subject } from "../subject";

export interface UpdateUser {
  subject: Subject.UPDATE_USER;
  data: Document;
}
