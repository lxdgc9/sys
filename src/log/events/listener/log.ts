import mongoose from "mongoose";
import { Listener, Subject } from "@lxdgc9/pkg/dist/events";
import { Log } from "@lxdgc9/pkg/dist/events/log";
import { Message } from "node-nats-streaming";
import { schema } from "../../schemas";
import { qGroup } from "./qgroup";

export class LogListener extends Listener<Log> {
  subject: Subject.LOG = Subject.LOG;
  qGroup = qGroup;

  async onMsg(data: Log["data"], msg: Message) {
    const { user_id, model, action, data: _data } = data;

    const Model = mongoose.model(model, schema);
    const newDoc = new Model({
      actor: user_id,
      action,
      data: _data,
    });
    await newDoc.save();

    msg.ack();
  }
}
