import { Publisher, Subject } from "@lxdgc9/pkg/dist/events";
import { DeleteManyUser } from "@lxdgc9/pkg/dist/events/user";

export class DeleteManyUserPublisher extends Publisher<DeleteManyUser> {
  subject: Subject.DELETE_MANY_USER = Subject.DELETE_MANY_USER;
}
