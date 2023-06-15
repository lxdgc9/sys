import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Role } from "../../models/role";

const modifyRole: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    rule_ids,
  }: {
    name?: string;
    level?: number;
    rule_ids?: Types.ObjectId[];
  } = req.body;

  try {
    const [hasRole, numRules] = await Promise.all([
      Role.exists({ _id: req.params.id }),
      Rule.countDocuments({
        _id: { $in: rule_ids },
      }),
    ]);
    if (!hasRole) {
      throw new NotFoundErr("Không tìm thấy vai trò");
    }
    if (rule_ids && numRules < rule_ids.length) {
      throw new BadReqErr("Danh sách quyền không hợp lệ");
    }

    const modRole = await Role.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: rule_ids
          ? {
              name: name,
              level: level,
              rules: rule_ids,
            }
          : {
              name: name,
              level: level,
            },
      },
      { new: true }
    )
      .lean()
      .populate("rules", "-catalog");
    res.json(modRole);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "update",
      data: modRole,
    });
  } catch (e) {
    next(e);
  }
};

export default modifyRole;
