import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { DeleteManyUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../model/user";
import { qGroup } from "../qgroup";

export class DeleteManyUserListener extends Listener<DeleteManyUser> {
  subject: Subject.DELETE_MANY_USER = Subject.DELETE_MANY_USER;
  qGroup = qGroup;

  async onMsg(ids: DeleteManyUser["data"], msg: Message) {
    await User.deleteMany({
      userId: {
        $in: ids,
      },
    });

    msg.ack();
  }
}
