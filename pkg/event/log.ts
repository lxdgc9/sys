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
    model: string;
    uid?: Types.ObjectId;
    act: Actions;
    doc: any;
  };
}
