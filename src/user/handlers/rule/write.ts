import { RequestHandler } from "express";
import { Types } from "mongoose";
import { ConflictErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const writeRule: RequestHandler = async (req, res, next) => {
  const {
    code,
    info,
    catalog_id,
  }: {
    code: string;
    info: string;
    catalog_id: Types.ObjectId;
  } = req.body;

  try {
    const [hasRule, hasCatalog] = await Promise.all([
      Rule.exists({ code: code }),
      Catalog.exists({ _id: catalog_id }),
    ]);
    if (hasRule) {
      throw new ConflictErr("Duplicate code");
    }
    if (!hasCatalog) {
      throw new NotFoundErr("Catalog not found");
    }

    const rule = new Rule({
      code,
      info,
      catalog: catalog_id,
    });
    await rule.save();
    await rule.populate("catalog", "-rules");
    res.status(201).json(rule);

    await Promise.allSettled([
      Catalog.updateOne(
        { _id: catalog_id },
        {
          $addToSet: {
            rules: rule,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Rule.modelName,
        action: "insert",
        data: rule,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writeRule;
