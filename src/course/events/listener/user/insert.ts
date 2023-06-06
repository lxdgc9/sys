import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { InsertUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { User } from "../../../models/user";
import { qGroup } from "../qgroup";

export class InsertUserListener extends Listener<InsertUser> {
  subject: Subject.INSERT_USER = Subject.INSERT_USER;
  qGroup = qGroup;

  async onMsg(data: InsertUser["data"], msg: Message) {
    const newUser = new User({
      uid: data.id,
      obj: data,
    });
    newUser.save();

    msg.ack();
  }
}
