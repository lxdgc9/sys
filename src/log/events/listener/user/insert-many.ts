import { Listener, Subject } from "@lxdgc9/pkg/dist/events";
import { InsertManyUser } from "@lxdgc9/pkg/dist/events/user";
import { Message } from "node-nats-streaming";
import { Actor } from "../../../models/actor";
import { qGroup } from "../qgroup";

export class InsertManyUserListener extends Listener<InsertManyUser> {
  subject: Subject.INSERT_MANY_USER = Subject.INSERT_MANY_USER;
  qGroup = qGroup;

  async onMsg(data: InsertManyUser["data"], msg: Message) {
    await Actor.insertMany(
      data.map((user) => ({
        user_id: user.id,
        data: user,
      }))
    );

    msg.ack();
  }
}
