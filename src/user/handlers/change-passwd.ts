import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { LogPublisher } from "../events/publisher/log";
import { User } from "../models/user";
import { nats } from "../nats";

export const changePasswd: RequestHandler = async (req, res, next) => {
  const {
    old_passwd: oldPasswd,
    new_passwd: newPasswd,
  }: {
    old_passwd: string;
    new_passwd: string;
  } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new BadReqErr("user not found");
    }

    if (!(await compare(oldPasswd, user.passwd))) {
      throw new BadReqErr("wrong password");
    }

    user.passwd = newPasswd;
    await user.save();

    res.json({ msg: "changed" });

    await new LogPublisher(nats.cli).publish({
      model: User.modelName,
      uid: req.user?.id,
      act: Actions.update,
      doc: user,
    });
  } catch (e) {
    next(e);
  }
};
