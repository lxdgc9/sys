import fs from "fs";
import path from "path";
import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";

const readFile: RequestHandler = (req, res, next) => {
  const dest = path.join("uploads", req.params[0]);

  try {
    if (!fs.existsSync(dest)) {
      throw new NotFoundErr("File not found");
    }

    fs.createReadStream(dest).pipe(res);
  } catch (e) {
    next(e);
  }
};

export default readFile;
