import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Role } from "../../models/role";

const writeRoles: RequestHandler = async (req, res, next) => {
  const roles: {
    name: string;
    level: number;
    rule_ids: Types.ObjectId[];
  }[] = req.body;

  const ruleIds = [...new Set(roles.map((r) => r.rule_ids).flat())];

  try {
    const numRules = await Rule.countDocuments({
      _id: { $in: ruleIds },
    });
    if (numRules < ruleIds.length) {
      throw new BadReqErr("Danh sách quyền không hợp lệ");
    }

    const nRoles = await Role.insertMany(
      roles.map(({ name, level, rule_ids }) => ({
        name,
        level,
        rules: rule_ids,
      }))
    );

    await Role.populate(nRoles, {
      path: "rules",
      select: "-catalog",
    });
    res.json(nRoles);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "insert",
      data: nRoles,
    });
  } catch (e) {
    next(e);
  }
};

export default writeRoles;
