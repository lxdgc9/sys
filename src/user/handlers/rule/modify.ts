import { RequestHandler } from "express";
import { Types } from "mongoose";
import { ConflictErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";

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
    const rule = await Rule.findById(req.params.id).lean();
    if (!rule) {
      throw new NotFoundErr("Không tìm thấy quyền");
    }

    const [isDupl, hasCatalog] = await Promise.all([
      code &&
        Rule.exists({
          $and: [
            {
              _id: { $ne: rule._id },
            },
            { code: code },
          ],
        }),
      catalog_id &&
        Catalog.exists({
          _id: {
            $in: catalog_id,
          },
        }),
    ]);
    if (code && isDupl) {
      throw new ConflictErr("Tồn tại code trong hệ thống");
    }
    if (catalog_id && !hasCatalog) {
      throw new NotFoundErr("Không tìm thấy danh mục");
    }

    const modRule = await Rule.findByIdAndUpdate(
      rule._id,
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
        { _id: modRule!.catalog._id },
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
