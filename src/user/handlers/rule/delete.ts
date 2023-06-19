import { RequestHandler } from "express";
import { BadReqErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";
import { Role } from "../../models/role";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const deleteRule: RequestHandler = async (req, res, next) => {
  try {
    const [rule, hasDepend] = await Promise.all([
      Rule.findById(req.params.id).populate("catalog", "-rules"),
      Role.exists({ rules: { $in: req.params.id } }),
    ]);
    if (!rule) {
      throw new NotFoundErr("Rule not found");
    }
    if (hasDepend) {
      throw new BadReqErr("Found dependent");
    }

    await rule.deleteOne();
    res.sendStatus(204);

    await Promise.allSettled([
      Catalog.updateOne(
        { _id: rule.catalog._id },
        {
          $pull: {
            rules: rule._id,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Rule.modelName,
        action: "delete",
        data: rule,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default deleteRule;
