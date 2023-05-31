import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const deletePerm: RequestHandler = async (req, res, next) => {
  try {
    // Tiến hành xóa, nếu không tồn tại trong db thì thông báo
    const perm = await Perm.findByIdAndDelete(req.params.id).populate({
      path: "group",
      select: "-perms",
    });
    if (!perm) {
      throw new BadReqErr("permission not found");
    }

    res.json({ msg: "deleted" });

    await Promise.all([
      // Sau khi xóa thành công, cập nhật property của group chứa permission
      // đã xóa này
      PermGr.findByIdAndUpdate(perm.group, {
        $pull: {
          perms: perm._id,
        },
      }),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Perm.modelName,
        act: Actions.delete,
        doc: perm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
