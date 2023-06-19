import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";
import { Role } from "../../models/role";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const deleteRules: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const [rules, hasDepend] = await Promise.all([
      Rule.find({ _id: { $in: ids } }),
      Role.exists({ rules: { $in: ids } }),
    ]);
    if (rules.length < ids.length) {
      throw new BadReqErr("Invalid array");
    }
    if (hasDepend) {
      throw new BadReqErr("Found dependent");
    }

    await Rule.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);

    await Rule.populate(rules, {
      path: "catalog",
      select: "-rules",
    });

    await Promise.allSettled([
      Catalog.updateMany(
        {
          rules: { $in: ids },
        },
        {
          $pullAll: {
            rules: ids,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Rule.modelName,
        action: "delete",
        data: rules,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default deleteRules;
