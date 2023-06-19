import { RequestHandler } from "express";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { User } from "../../models/user";
import { DeleteUserPublisher } from "../../events/publisher/user/delete";
import { LogPublisher } from "../../events/publisher/log";
import nats from "../../nats";

const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).populate({
      path: "role",
      populate: {
        path: "rules",
        select: "-catalog",
      },
    });
    if (!user) {
      throw new NotFoundErr("User not found");
    }
    res.sendStatus(204);

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

export default deleteUser;
