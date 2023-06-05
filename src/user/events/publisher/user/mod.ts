import { Publisher, Subject } from "@lxdgc9/pkg/dist/event";
import { UpdateUser } from "@lxdgc9/pkg/dist/event/user";

export class UpdateUserPublisher extends Publisher<UpdateUser> {
  subject: Subject.UPDATE_USER = Subject.UPDATE_USER;
}
