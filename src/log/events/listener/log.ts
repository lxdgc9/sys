import { Listener, Subject } from "@lxdgc9/pkg/dist/event";
import { Log } from "@lxdgc9/pkg/dist/event/log";
import { model } from "mongoose";
import { Message } from "node-nats-streaming";
import { schema } from "../../schemas";
import { qGroup } from "./qgroup";

export class LogListener extends Listener<Log> {
  subject: Subject.LOG = Subject.LOG;
  qGroup = qGroup;

  async onMsg(data: Log["data"], msg: Message) {
    const { uid, model: _model, act, doc } = data;

    const Model = model(_model, schema);
    const newDoc = new Model({
      actor: uid,
      act,
      doc,
    });
    await newDoc.save();

    msg.ack();
  }
}
