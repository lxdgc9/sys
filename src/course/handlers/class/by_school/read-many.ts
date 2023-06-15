import { RequestHandler } from "express";
import { School } from "../../../models/school";

const readClasses: RequestHandler = async (req, res, next) => {
  try {
    const classes = await School.findById(req.params.id);
    res.json(classes);
  } catch (e) {
    console.log(e);
    next(e);
  }
};

export default readClasses;
