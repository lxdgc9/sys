import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { InsertUser } from "@lxdgc9/pkg/dist/event/user";

export class InsertUserPublisher extends Publisher<InsertUser> {
  subject: Subject.INSERT_USER = Subject.INSERT_USER;
}
