import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Role } from "../../models/role";

const writeRole: RequestHandler = async (req, res, next) => {
  const {
    name,
    level,
    rule_ids,
  }: {
    name: string;
    level: number;
    rule_ids: Types.ObjectId[];
  } = req.body;

  try {
    const numRules = await Rule.countDocuments({
      _id: { $in: rule_ids },
    });
    if (numRules < rule_ids.length) {
      throw new BadReqErr("Danh sách rule_ids không hợp lệ");
    }

    const nRole = new Role({
      name: name,
      level: level,
      rules: rule_ids,
    });
    await nRole.save();

    await nRole.populate("rules", "-catalog");
    res.json(nRole);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "insert",
      data: nRole,
    });
  } catch (e) {
    next(e);
  }
};

export default writeRole;
