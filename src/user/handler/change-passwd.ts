import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { compare } from "bcryptjs";
import { RequestHandler } from "express";
import { LogPublisher } from "../event/publisher/log";
import { User } from "../model/user";
import { nats } from "../nats";

export const changePasswd: RequestHandler = async (req, res, next) => {
  const {
    oldPasswd,
    newPasswd,
  }: {
    oldPasswd: string;
    newPasswd: string;
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
      userId: req.user?.id,
      model: User.modelName,
      act: Actions.update,
      doc: user,
    });
  } catch (e) {
    next(e);
  }
};
