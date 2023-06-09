import { ErrorRequestHandler } from "express";
import { HttpErr } from "../err/http";

export const errHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.log(err);

  if (err instanceof HttpErr) {
    return res.status(err.code).json({ msg: err.message });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ msg: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Token expired" });
  }

  res.status(500).json({ msg: "Something went wrong" });
};
