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
    act: Actions; // hành động
    doc: any; // đối tượng
    model: string; // tên model
    userId?: Types.ObjectId; // chủ thể  (người thực hiện)
  };
}
