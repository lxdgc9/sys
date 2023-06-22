import { RequestHandler } from "express";
import { Catalog } from "../../models/catalog";

const readCatalogs: RequestHandler = async (_req, res, next) => {
  try {
    const catalogs = await Catalog.find().lean().populate("rules", "-catalog");
    res.json(catalogs);
  } catch (e) {
    next(e);
  }
};

export default readCatalogs;
