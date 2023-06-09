import { Listener, Subject } from "@lxdgc9/pkg/dist/events";
import { UpdateUser } from "@lxdgc9/pkg/dist/events/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../models/actor";
import { qGroup } from "../qgroup";

export class UpdateUserListener extends Listener<UpdateUser> {
  subject: Subject.UPDATE_USER = Subject.UPDATE_USER;
  qGroup = qGroup;

  async onMsg(data: UpdateUser["data"], msg: Message) {
    await Actor.findOneAndUpdate(
      { user_id: data.id },
      {
        $set: {
          data,
        },
      }
    );

    msg.ack();
  }
}
