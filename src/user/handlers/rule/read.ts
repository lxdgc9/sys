import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Rule } from "../../models/rule";

const readRule: RequestHandler = async (req, res, next) => {
  try {
    const rule = await Rule.findById(req.params.id)
      .lean()
      .populate("catalog", "-rules");
    if (!rule) {
      throw new NotFoundErr("Không tìm thấy quyền");
    }

    res.json(rule);
  } catch (e) {
    next(e);
  }
};

export default readRule;
