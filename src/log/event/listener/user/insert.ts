import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { InsertUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../model/actor";
import { qGroup } from "../qgroup";

export class InsertUserListener extends Listener<InsertUser> {
  subject: Subject.INSERT_USER = Subject.INSERT_USER;
  qGroup = qGroup;

  async onMsg(data: InsertUser["data"], msg: Message) {
    const newUser = new Actor({
      userId: data.id,
      doc: data,
    });
    await newUser.save();

    msg.ack();
  }
}
