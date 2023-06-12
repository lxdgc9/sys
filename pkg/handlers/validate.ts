import { RequestHandler } from "express";
import { ValidationChain, validationResult } from "express-validator";

export function validator(...chains: ValidationChain[]) {
  const handler: RequestHandler = async (req, res, next) => {
    await Promise.all(chains.map((ch) => ch.run(req)));

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errs: errs.array() });
    }

    next();
  };

  return handler;
}
