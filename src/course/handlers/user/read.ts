import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";

const readUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate([
      { path: "schools", select: "-classes -members" },
      { path: "classes" },
      { path: "courses" },
    ]);
    if (!user) {
      throw new NotFoundErr("User not found");
    }

    res.json(user);
  } catch (e) {
    next(e);
  }
};

export default readUser;
