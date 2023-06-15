import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";
import { Role } from "../../models/role";

const delPerm: RequestHandler = async (req, res, next) => {
  try {
    const [perm, depend] = await Promise.all([
      Rule.findById(req.params.id).populate({
        path: "perm_group",
        select: "-items",
      }),
      Role.exists({ rules: { $in: req.params.id } }),
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
      Catalog.updateOne(
        { _id: perm.catalog._id },
        {
          $pull: {
            rules: perm._id,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Rule.modelName,
        action: "delete",
        data: perm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default delPerm;
