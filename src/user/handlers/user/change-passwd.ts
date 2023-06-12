import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { User } from "../../models/user";

const changePassword: RequestHandler = async (req, res, next) => {
  const {
    old_password,
    new_password,
  }: {
    old_password: string;
    new_password: string;
  } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new BadReqErr("User not found");
    }

    const match = await bcrypt.compare(old_password, user.password);
    if (!match) {
      throw new BadReqErr("Wrong password");
    }

    user.password = new_password;
    await user.save();
    res.sendStatus(200);

    const logPublisher = new LogPublisher(nats.cli);
    await logPublisher.publish({
      user_id: req.user?.id,
      model: User.modelName,
      action: "update",
      doc: user,
    });
  } catch (e) {
    next(e);
  }
};

export default changePassword;
