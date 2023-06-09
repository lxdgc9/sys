import { Publisher, Subject } from "@lxdgc9/pkg/dist/events";
import { InsertManyUser } from "@lxdgc9/pkg/dist/events/user";

export class InsertManyUserPublisher extends Publisher<InsertManyUser> {
  subject: Subject.INSERT_MANY_USER = Subject.INSERT_MANY_USER;
}
