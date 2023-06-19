import { Listener, Subject } from "@lxdgc9/pkg/dist/events";
import { InsertManyUser } from "@lxdgc9/pkg/dist/events/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../models/user";
import { qGroup } from "../qgroup";

export class InsertManyUserListener extends Listener<InsertManyUser> {
  subject: Subject.INSERT_MANY_USER = Subject.INSERT_MANY_USER;
  qGroup = qGroup;

  onMsg(data: InsertManyUser["data"], msg: Message) {
    console.log(data);
    User.insertMany(
      data.map(({ id, attrs, role, rules, is_active }) => ({
        user_id: id,
        attrs,
        role,
        rules,
        is_active,
      }))
    );

    msg.ack();
  }
}
