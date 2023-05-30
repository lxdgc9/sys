import { Document } from "mongoose";
import { Subject } from "../subject";

export interface InsertUser {
  subject: Subject.INSERT_USER;
  data: Document;
}
