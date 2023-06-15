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
      Role.find({ _id: { $in: ids } }).lean(),
      User.exists({ role: { $in: ids } }),
    ]);
    if (roles.length < ids.length) {
      throw new BadReqErr("Danh sách không hợp lệ");
    }
    if (isDepend) {
      throw new BadReqErr("Có ràng buộc liên kết");
    }

    await Role.deleteMany({
      _id: { $in: ids },
    });
    res.sendStatus(204);

    await Role.populate(roles, {
      path: "rules",
      select: "-catalog",
    });
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
