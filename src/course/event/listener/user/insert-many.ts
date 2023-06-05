import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { InsertManyUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../models/user";
import { qGroup } from "../qgroup";

export class InsertManyUserListener extends Listener<InsertManyUser> {
  subject: Subject.INSERT_MANY_USER = Subject.INSERT_MANY_USER;
  qGroup = qGroup;

  async onMsg(data: InsertManyUser["data"], msg: Message) {
    await User.insertMany(
      data.map((u) => ({
        userId: u.id,
        obj: u,
      }))
    );

    msg.ack();
  }
}
