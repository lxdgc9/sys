import { Listener, Subject } from "@lxdgc9/pkg/dist/events";
import { UpdateUser } from "@lxdgc9/pkg/dist/events/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../models/user";
import { qGroup } from "../qgroup";

export class UpdateUserListener extends Listener<UpdateUser> {
  subject: Subject.UPDATE_USER = Subject.UPDATE_USER;
  qGroup = qGroup;

  onMsg(data: UpdateUser["data"], msg: Message) {
    const { id, attrs, role, is_active } = data;
    User.findOneAndUpdate(
      { user_id: id },
      {
        $set: {
          attrs,
          role,
          is_active,
        },
      }
    );

    msg.ack();
  }
}
