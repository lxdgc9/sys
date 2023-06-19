import { RequestHandler } from "express";
import { Rule } from "../../models/rule";

const readRules: RequestHandler = async (_req, res, next) => {
  try {
    const rules = await Rule.find().populate("catalog", "-rules");

    res.json(rules);
  } catch (e) {
    next(e);
  }
};

export default readRules;
