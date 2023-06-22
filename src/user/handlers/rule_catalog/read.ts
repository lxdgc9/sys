import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Catalog } from "../../models/catalog";

const readCatalog: RequestHandler = async (req, res, next) => {
  try {
    const catalog = await Catalog.findById(req.params.id)
      .lean()
      .populate("rules", "-catalog");
    if (!catalog) {
      throw new NotFoundErr("Catalog not found");
    }

    res.json(catalog);
  } catch (e) {
    next(e);
  }
};

export default readCatalog;
