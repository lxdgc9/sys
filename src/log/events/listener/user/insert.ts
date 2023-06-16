import { Listener, Subject } from "@lxdgc9/pkg/dist/events";
import { InsertUser } from "@lxdgc9/pkg/dist/events/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../models/actor";
import { qGroup } from "../qgroup";

export class InsertUserListener extends Listener<InsertUser> {
  subject: Subject.INSERT_USER = Subject.INSERT_USER;
  qGroup = qGroup;

  async onMsg(data: InsertUser["data"], msg: Message) {
    console.log("debug:", data);
    const newItem = new Actor({
      user_id: data._id,
      data: data,
    });
    await newItem.save();

    msg.ack();
  }
}
