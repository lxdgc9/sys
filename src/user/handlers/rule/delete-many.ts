import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";
import { Role } from "../../models/role";

const deleteRules: RequestHandler = async (req, res, next) => {
  const ids = [...new Set(req.body)] as Types.ObjectId[];

  try {
    const [rules, hasDepend] = await Promise.all([
      Rule.find({ _id: { $in: ids } }).lean(),
      Role.exists({ rules: { $in: ids } }),
    ]);
    if (rules.length < ids.length) {
      throw new BadReqErr("Hệ thống không chấp nhận danh sách");
    }
    if (hasDepend) {
      throw new BadReqErr("Có ràng buộc liên kết");
    }

    await Rule.deleteMany({
      _id: { $in: ids },
    });
    res.json({ msg: "Xóa thành công" });

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
