import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { UpdateUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../model/user";
import { qGroup } from "../qgroup";

export class UpdateUserListener extends Listener<UpdateUser> {
  subject: Subject.UPDATE_USER = Subject.UPDATE_USER;
  qGroup = qGroup;

  async onMsg(data: UpdateUser["data"], msg: Message) {
    await User.findOneAndUpdate(
      { uid: data.id },
      {
        $set: {
          obj: data,
        },
      }
    );

    msg.ack();
  }
}
