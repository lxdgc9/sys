import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { connection, model } from "mongoose";
import { schema } from "../schema";

export const logs: RequestHandler = async (req, res, next) => {
  try {
    const parts = (await connection.db.listCollections().toArray()).map(
      (c) => c.name
    );
    if (!parts.includes(req.params.part)) {
      throw new BadReqErr("part not found");
    }

    res.json({
      log: await model(req.params.part, schema).find().populate({
        path: "actor",
        select: "doc",
      }),
    });
  } catch (e) {
    next(e);
  }
};
