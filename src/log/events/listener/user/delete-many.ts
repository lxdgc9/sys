import { Listener, Subject } from "@lxdgc9/pkg/dist/events";
import { DeleteManyUser } from "@lxdgc9/pkg/dist/events/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../models/actor";
import { qGroup } from "../qgroup";

export class DeleteManyUserListener extends Listener<DeleteManyUser> {
  subject: Subject.DELETE_MANY_USER = Subject.DELETE_MANY_USER;
  qGroup = qGroup;

  async onMsg(ids: DeleteManyUser["data"], msg: Message) {
    await Actor.deleteMany({
      user_id: { $in: ids },
    });

    msg.ack();
  }
}
