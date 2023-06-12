import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Perm } from "../../models/perm";
import { PermGroup } from "../../models/perm-group";
import { Role } from "../../models/role";

const delPerm: RequestHandler = async (req, res, next) => {
  try {
    const [perm, depend] = await Promise.all([
      Perm.findById(req.params.id).populate({
        path: "perm_group",
        select: "-items",
      }),
      Role.exists({
        perms: { $in: req.params.id },
      }),
    ]);
    if (!perm) {
      throw new BadReqErr("Permission not found");
    }
    if (depend) {
      throw new BadReqErr("Found dependent");
    }

    await perm.deleteOne();

    res.sendStatus(204);

    await Promise.allSettled([
      PermGroup.findByIdAndUpdate(perm.perm_group._id, {
        $pull: {
          items: perm._id,
        },
      }),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Perm.modelName,
        action: "delete",
        doc: perm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default delPerm;
