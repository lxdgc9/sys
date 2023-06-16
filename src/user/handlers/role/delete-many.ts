import { RequestHandler } from "express";
import { Types } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Role } from "../../models/role";
import { User } from "../../models/user";

const deleteRoles: RequestHandler = async (req, res, next) => {
  const ids: Types.ObjectId[] = req.body;

  try {
    const [roles, isDepend] = await Promise.all([
      Role.find({ _id: { $in: ids } })
        .lean()
        .populate("rules", "-catalog"),
      User.exists({ role: { $in: ids } }),
    ]);
    if (roles.length < ids.length) {
      throw new BadReqErr("Invalid array");
    }
    if (isDepend) {
      throw new BadReqErr("Found dependent");
    }

    await Role.deleteMany({ _id: { $in: ids } });
    res.sendStatus(204);

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "delete",
      data: roles,
    });
  } catch (e) {
    next(e);
  }
};

export default deleteRoles;
