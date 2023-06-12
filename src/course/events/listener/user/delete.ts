import { Listener, Subject } from "@lxdgc9/pkg/dist/events";
import { DeleteUser } from "@lxdgc9/pkg/dist/events/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../models/user";
import { qGroup } from "../qgroup";

export class DeleteUserListener extends Listener<DeleteUser> {
  subject: Subject.DELETE_USER = Subject.DELETE_USER;
  qGroup = qGroup;

  async onMsg(id: DeleteUser["data"], msg: Message) {
    await User.findOneAndDelete({ user_id: id });

    msg.ack();
  }
}
