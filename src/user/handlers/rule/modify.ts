import { RequestHandler } from "express";
import { Types } from "mongoose";
import { ConflictErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/catalog";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const modifyRule: RequestHandler = async (req, res, next) => {
  const {
    code,
    info,
    catalog_id,
  }: {
    code?: string;
    info?: string;
    catalog_id?: Types.ObjectId;
  } = req.body;

  try {
    const rule = await Rule.findById({ _id: req.params.id }).lean();
    if (!rule) {
      throw new NotFoundErr("Rule not found");
    }

    const [hasCode, hasCatalog] = await Promise.all([
      code &&
        Rule.exists({
          $and: [
            {
              _id: { $ne: req.params.id },
            },
            { code: code },
          ],
        }),
      catalog_id && Catalog.exists({ _id: { $in: catalog_id } }),
    ]);
    if (code && hasCode) {
      throw new ConflictErr("Duplicate code");
    }
    if (catalog_id && !hasCatalog) {
      throw new NotFoundErr("Catalog not found");
    }

    const modRule = await Rule.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          code,
          info,
          catalog: catalog_id,
        },
      },
      { new: true }
    )
      .lean()
      .populate("catalog", "-rules");
    res.json(modRule);

    await Promise.allSettled([
      Catalog.updateOne(
        { _id: rule.catalog },
        {
          $pull: {
            rules: rule._id,
          },
        }
      ),
      Catalog.updateOne(
        { _id: catalog_id },
        {
          $addToSet: {
            rules: rule._id,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Rule.modelName,
        action: "update",
        data: modRule,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default modifyRule;
