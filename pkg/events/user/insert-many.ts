import { Document } from "mongoose";
import { Subject } from "../subject";

export interface InsertManyUser {
  subject: Subject.INSERT_MANY_USER;
  data: Document[];
}
