import { Publisher, Subject } from "@lxdgc9/pkg/dist/events";
import { UpdateUser } from "@lxdgc9/pkg/dist/events/user";

export class UpdateUserPublisher extends Publisher<UpdateUser> {
  subject: Subject.UPDATE_USER = Subject.UPDATE_USER;
}
