import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { Role } from "../../models/role";

export const readRole: RequestHandler = async (req, res, next) => {
  try {
    const role = await Role.findById(req.params.id).populate({
      path: "perms",
      select: "-perm_group",
    });
    if (!role) {
      throw new NotFoundErr("role not found");
    }

    res.json(role);
  } catch (e) {
    next(e);
  }
};
