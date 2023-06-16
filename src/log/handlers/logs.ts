import { RequestHandler } from "express";
import { connection, model } from "mongoose";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { schema } from "../schemas";

const readLogs: RequestHandler = async (req, res, next) => {
  try {
    const parts = (await connection.db.listCollections().toArray()).map(
      (part) => part.name
    );
    if (!parts.includes(req.params.part)) {
      throw new BadReqErr("Part not found");
    }

    const logs = await model(req.params.part, schema).find().populate({
      path: "actor",
      select: "doc",
    });

    res.json(logs);
  } catch (e) {
    next(e);
  }
};

export default readLogs;
