import { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import { BadReqErr, NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const modifyPassword: RequestHandler = async (req, res, next) => {
  const {
    old_password,
    new_password,
  }: {
    old_password: string;
    new_password: string;
  } = req.body;

  try {
    const user = await User.findById(req.user?.id);
    if (!user) {
      throw new NotFoundErr("Không tìm thấy người dùng");
    }

    const isMatch = await bcrypt.compare(old_password, user.password);
    if (!isMatch) {
      throw new BadReqErr("Sai mật khẩu");
    }

    user.password = new_password;
    await user.save();

    res.json({ msg: "Đổi mật khẩu thành công" });

    await new LogPublisher(nats.cli).publish({
      user_id: req.user?.id,
      model: User.modelName,
      action: "update",
      data: user,
    });
  } catch (e) {
    next(e);
  }
};

export default modifyPassword;
