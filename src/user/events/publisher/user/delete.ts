import { Publisher, Subject } from "@lxdgc9/pkg/dist/events";
import { DeleteUser } from "@lxdgc9/pkg/dist/events/user";

export class DeleteUserPublisher extends Publisher<DeleteUser> {
  subject: Subject.DELETE_USER = Subject.DELETE_USER;
}
