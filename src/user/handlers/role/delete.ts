import { RequestHandler } from "express";
import { BadReqErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Role } from "../../models/role";
import { User } from "../../models/user";

const deleteRole: RequestHandler = async (req, res, next) => {
  try {
    const [role, isDepend] = await Promise.all([
      Role.findById(req.params.id).populate("rules", "-catalog"),
      User.exists({ role: req.params.id }),
    ]);
    if (!role) {
      throw new NotFoundErr("Role not found");
    }
    if (isDepend) {
      throw new BadReqErr("Fount dependent");
    }

    await role.deleteOne();
    res.sendStatus(204);

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

export default deleteRole;
