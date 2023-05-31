import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { InsertManyUser } from "@lxdgc9/pkg/dist/event/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../model/actor";
import { qGroup } from "../qgroup";

export class InsertManyUserListener extends Listener<InsertManyUser> {
  subject: Subject.INSERT_MANY_USER = Subject.INSERT_MANY_USER;
  qGroup = qGroup;

  async onMsg(data: InsertManyUser["data"], msg: Message) {
    await Actor.insertMany(data);

    msg.ack();
  }
}
