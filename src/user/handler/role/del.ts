import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../event/publisher/log";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const delRole: RequestHandler = async (req, res, next) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      throw new BadReqErr("role doesn't exist");
    }

    res.json({ msg: "delete successfully" });

    await new LogPublisher(nats.cli).publish({
      act: Actions.delete,
      model: Role.modelName,
      doc: role,
      userId: req.user?.id,
    });
  } catch (e) {
    next(e);
  }
};
