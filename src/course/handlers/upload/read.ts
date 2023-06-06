import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { RequestHandler } from "express";
import { createReadStream, existsSync } from "fs";
import { join } from "path";

export const readFile: RequestHandler = (req, res, next) => {
  const dest = join("uploads", req.params[0]);

  try {
    if (!existsSync(dest)) {
      throw new NotFoundErr("file not found");
    }

    const stream = createReadStream(dest);
    stream.pipe(res);
  } catch (e) {
    next(e);
  }
};
