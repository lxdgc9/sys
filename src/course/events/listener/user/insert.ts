import { Listener, Subject } from "@lxdgc9/pkg/dist/events";
import { InsertUser } from "@lxdgc9/pkg/dist/events/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../models/user";
import { qGroup } from "../qgroup";

export class InsertUserListener extends Listener<InsertUser> {
  subject: Subject.INSERT_USER = Subject.INSERT_USER;
  qGroup = qGroup;

  onMsg(data: InsertUser["data"], msg: Message) {
    const { id, attrs, role, rules, is_active } = data;

    const user = new User({
      user_id: id,
      attrs,
      role,
      rules,
      is_active,
    });
    user.save();

    msg.ack();
  }
}
