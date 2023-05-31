import { RequestHandler } from "express";
import { School } from "../../model/school";

export const getUnits: RequestHandler = async (req, res, next) => {
  const { cursor, size = 0 } = req.query;
  try {
    const units = await School.find(cursor ? { _id: { $lt: cursor } } : {})
      .sort({ _id: -1 })
      .limit(parseInt(size.toString()))
      .populate({
        path: "classes",
        select: "-unit",
      });
    res.json({ units });
  } catch (e) {
    next(e);
  }
};
