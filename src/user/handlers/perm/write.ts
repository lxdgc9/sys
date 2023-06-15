import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr, ConflictErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Rule } from "../../models/rule";
import { Catalog } from "../../models/rule-catalog";

const writePerm: RequestHandler = async (req, res, next) => {
  const {
    code,
    info,
    perm_group_id,
  }: {
    code: string;
    info: string;
    perm_group_id: Types.ObjectId;
  } = req.body;

  try {
    const [dupl, group] = await Promise.all([
      Rule.exists({ code: code }),
      Catalog.exists({ _id: perm_group_id }),
    ]);
    if (dupl) {
      throw new ConflictErr("Code already exist");
    }
    if (!group) {
      throw new BadReqErr("Permission Group not found");
    }

    const perm = new Rule({
      code,
      info,
      perm_group: group,
    });
    await perm.save();
    await Rule.populate(perm, {
      path: "perm_group",
      select: "-items",
    });
    res.status(201).json(perm);

    await Promise.allSettled([
      Catalog.updateOne(
        { _id: perm_group_id },
        {
          $addToSet: {
            rules: perm,
          },
        }
      ),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: Rule.modelName,
        action: "insert",
        data: perm,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default writePerm;
