import { Subject } from "../subject";

export interface DeleteManyUser {
  subject: Subject.DELETE_MANY_USER;
  data: Document[];
}
