import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { PermGroup } from "../../models/perm-group";

const readPermGroup: RequestHandler = async (req, res, next) => {
  try {
    const group = await PermGroup.findById(req.params.id)
      .lean()
      .select("-items");
    if (!group) {
      throw new NotFoundErr("Permission Group not found");
    }

    res.json(group);
  } catch (e) {
    next(e);
  }
};

export default readPermGroup;
