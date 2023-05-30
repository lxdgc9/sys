import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const deletePerm: RequestHandler = async (req, res, next) => {
  try {
    const perm = await Perm.findByIdAndDelete(req.params.id);
    if (!perm) {
      throw new BadReqErr("permission not found");
    }

    res.json({ msg: "deleted permission" });

    await Promise.all([
      PermGr.findByIdAndUpdate(perm.group, {
        $pull: { perms: perm._id },
      }),
      new LogPublisher(nats.cli).publish({
        act: "DEL",
        model: Perm.modelName,
        doc: perm,
        userId: req.user?.id,
        status: true,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
