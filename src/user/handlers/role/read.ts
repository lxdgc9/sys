import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Role } from "../../models/role";

const readRole: RequestHandler = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id)
      .lean()
      .populate("rules", "-catalog");
    if (!role) {
      throw new NotFoundErr("Không tìm thấy role");
    }

    res.json(role);
  } catch (e) {
    next(e);
  }
};

export default readRole;
