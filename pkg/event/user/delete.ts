import { Subject } from "../subject";

export interface DeleteUser {
  subject: Subject.DELETE_USER;
  data: Document;
}
