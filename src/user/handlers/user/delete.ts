import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import nats from "../../nats";
import { LogPublisher } from "../../events/publisher/log";
import { DeleteUserPublisher } from "../../events/publisher/user/delete";
import { User } from "../../models/user";

const delUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
      .lean()
      .populate({
        path: "role",
        populate: {
          path: "rules",
          select: "-catalog",
        },
      });
    if (!user) {
      throw new NotFoundErr("Không tìm thấy người dùng");
    }
    res.json({ msg: "Xóa thành công" });

    await Promise.allSettled([
      new DeleteUserPublisher(nats.cli).publish(user._id),
      new LogPublisher(nats.cli).publish({
        user_id: req.user?.id,
        model: User.modelName,
        action: "delete",
        data: user,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};

export default delUser;
