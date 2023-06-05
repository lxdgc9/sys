import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { DeleteManyUser } from "@lxdgc9/pkg/dist/event/user";

export class DeleteManyUserPublisher extends Publisher<DeleteManyUser> {
  subject: Subject.DELETE_MANY_USER = Subject.DELETE_MANY_USER;
}
