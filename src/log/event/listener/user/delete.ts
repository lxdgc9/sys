import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { DeleteUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../model/actor";
import { qGroup } from "../qgroup";

export class DeleteUserListener extends Listener<DeleteUser> {
  subject: Subject.DELETE_USER = Subject.DELETE_USER;
  qGroup = qGroup;

  async onMsg(id: DeleteUser["data"], msg: Message) {
    await Actor.findOneAndDelete({ userId: id });

    msg.ack();
  }
}
