import { Publisher, Subject } from "@lxdgc9/pkg/dist/events";
import { Log } from "@lxdgc9/pkg/dist/events/log";

export class LogPublisher extends Publisher<Log> {
  subject: Subject.LOG = Subject.LOG;
}
