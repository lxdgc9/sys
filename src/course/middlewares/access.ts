import { RequestHandler } from "express";

const access: RequestHandler = async (req, res, next) => {
  try {
    res.json();
  } catch (e) {
    next(e);
  }
};

export default access;
