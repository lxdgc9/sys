import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { InsertManyUser } from "@lxdgc9/pkg/dist/event/user";

export class InsertManyUserPublisher extends Publisher<InsertManyUser> {
  subject: Subject.INSERT_MANY_USER = Subject.INSERT_MANY_USER;
}
