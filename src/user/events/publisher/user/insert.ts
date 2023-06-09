import { Publisher, Subject } from "@lxdgc9/pkg/dist/events";
import { InsertUser } from "@lxdgc9/pkg/dist/events/user";

export class InsertUserPublisher extends Publisher<InsertUser> {
  subject: Subject.INSERT_USER = Subject.INSERT_USER;
}
