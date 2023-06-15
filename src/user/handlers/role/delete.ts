import { RequestHandler } from "express";
import { BadReqErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { Role } from "../../models/role";
import { User } from "../../models/user";

const deleteRole: RequestHandler = async (req, res, next) => {
  try {
    const [hasRole, isDepend] = await Promise.all([
      Role.exists({ _id: req.params.id }),
      User.exists({ role: req.params.id }),
    ]);
    if (!hasRole) {
      throw new NotFoundErr("Không tìm thấy vai trò");
    }
    if (isDepend) {
      throw new BadReqErr("Có ràng buộc liên kết");
    }

    const role = await Role.findByIdAndDelete(req.params.id)
      .lean()
      .populate("rules", "-catalog");
    res.json({ msg: "Xóa thành công" });

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
