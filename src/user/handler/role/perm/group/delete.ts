import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../../event/publisher/log";
import { Perm } from "../../../../model/perm";
import { PermGr } from "../../../../model/perm-gr";
import { nats } from "../../../../nats";

export const deleteGroup: RequestHandler = async (req, res, next) => {
  try {
    const group = await PermGr.findByIdAndDelete(req.params.id);
    if (!group) {
      throw new BadReqErr("group not found");
    }

    res.json({ msg: "deleted" });

    await Promise.all([
      // Xóa các permission sử dụng group này
      Perm.deleteMany({
        _id: {
          $in: group.perms,
        },
      }),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: PermGr.modelName,
        act: Actions.delete,
        doc: group,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
