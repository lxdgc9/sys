import { RequestHandler } from "express";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Role } from "../../models/role";
import { User } from "../../models/user";

const delRole: RequestHandler = async (req, res, next) => {
  try {
    const [role, depend] = await Promise.all([
      Role.findById(req.params.id),
      User.exists({ role: req.params.id }),
    ]);
    if (!role) {
      throw new BadReqErr("Role not found");
    }
    if (depend) {
      throw new BadReqErr("Found dependent");
    }

    await role.deleteOne();
    res.sendStatus(204);

    await Role.populate(role, {
      path: "perms",
      select: "-perm_group",
    });
    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: Role.modelName,
      action: "delete",
      data: role,
    });
  } catch (e) {
    next(e);
  }
};

export default delRole;
