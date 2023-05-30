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
    userId?: Types.ObjectId; // chủ thể  (người thực hiện)
    model: string; // tên model
    act: Actions; // hành động
    doc: any; // đối tượng
  };
}
