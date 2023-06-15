import { RequestHandler } from "express";
import { Catalog } from "../../models/rule-catalog";

const readRules: RequestHandler = async (_req, res, next) => {
  try {
    const rules = await Catalog.find().lean().populate("rules", "-catalog");

    res.json(rules);
  } catch (e) {
    next(e);
  }
};

export default readRules;
