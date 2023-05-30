import { RequestHandler } from "express";
import { PermGr } from "../../../../model/perm-gr";

export const insertManyGroup: RequestHandler = async (req, res, next) => {
  const {
    groups,
  }: {
    groups: {
      name: string;
    }[];
  } = req.body;

  try {
    res.status(201).json({
      groups: await PermGr.insertMany(groups),
    });
  } catch (e) {
    next(e);
  }
};
