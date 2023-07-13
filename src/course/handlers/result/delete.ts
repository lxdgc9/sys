import { RequestHandler } from "express";
import { Result } from "../../models/result";

export const deleteResult: RequestHandler = async (req, res, next) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    res.json({
      result,
    });
  } catch (e) {
    next(e);
  }
};
