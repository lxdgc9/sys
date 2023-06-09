import { RequestHandler } from "express";
import { ValidationChain, validationResult } from "express-validator";

export function validate(...chains: ValidationChain[]) {
  const hfunc: RequestHandler = async (req, res, next) => {
    for (const ch of chains) {
      await ch.run(req);
    }

    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errs: errs.array() });
    }

    next();
  };

  return hfunc;
}
