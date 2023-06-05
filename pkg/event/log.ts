import { Types } from "mongoose";
import { Subject } from "./subject";

export enum Actions {
  insert = "insert",
  update = "update",
  delete = "delete",
}

export interface Log {
  subject: Subject.LOG;
  data: {
    uid?: Types.ObjectId;
    model: string;
    act: Actions;
    doc: any;
  };
}
