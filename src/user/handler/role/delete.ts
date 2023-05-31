import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../event/publisher/log";
import { Role } from "../../model/role";
import { nats } from "../../nats";

export const deleteRole: RequestHandler = async (req, res, next) => {
  try {
    // Kiểm tra role có trong db hay không
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      throw new BadReqErr("role not found");
    }

    res.json({ msg: "deleted" });

    // Thông báo đến log service
    await Promise.all([
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Role.modelName,
        act: Actions.delete,
        doc: role,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
