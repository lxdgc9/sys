import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Catalog } from "../../models/rule-catalog";

const readCatalog: RequestHandler = async (req, res, next) => {
  try {
    const catalog = await Catalog.findById(req.params.id).lean();
    if (!catalog) {
      throw new NotFoundErr("Không tìm thấy danh mục");
    }

    res.json(catalog);
  } catch (e) {
    next(e);
  }
};

export default readCatalog;
