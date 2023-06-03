import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const insrtItems: RequestHandler = async (req, res, next) => {
  const items: {
    code: string;
    desc: string;
    group_id: Types.ObjectId[];
  }[] = req.body;

  try {
    const [uCode, uPermGrId] = items
      .reduce(
        (s, { code, group_id: permGrId }) => {
          s[0].add(code);
          s[1].add(permGrId);

          return s;
        },
        [new Set(), new Set()]
      )
      .map((el) => Array.from(el));

    if (uCode.length < items.length) {
      throw new BadReqErr("duplicate code");
    }

    // Tiến hành validate code và group
    const [isDupl, numGroups] = await Promise.all([
      Perm.exists({
        code: {
          $in: uCode,
        },
      }),
      PermGr.countDocuments({
        _id: {
          $in: uPermGrId,
        },
      }),
    ]);
    if (isDupl) {
      throw new BadReqErr("duplicate code");
    }
    if (numGroups < uPermGrId.length) {
      throw new BadReqErr("groupIds mismatch");
    }

    // Thêm đồng thời perrmission vào db
    const _perms = await Perm.insertMany(
      items.map(({ code, desc, group_id: groupId }) => ({
        code,
        desc,
        group: groupId,
      }))
    );

    // Fetch data từ documents đã tạo trả về client
    const docs = await Perm.find({
      _id: {
        $in: _perms.map((p) => p._id),
      },
    }).populate({
      path: "group",
      select: "-perms",
    });

    res.status(201).json({ perm: docs });

    await Promise.all([
      Array.from(
        // Tạo một mảng mới từ danh sách permission đã tạo trước đó với
        // k là id của group và v là danh sách permission sử dụng group này
        _perms
          .reduce((map, { _id, group }) => {
            const groupStr = group.toString();
            if (!map.has(groupStr)) {
              map.set(groupStr, []);
            }
            map.get(groupStr).push(_id);
            return map;
          }, new Map())
          .entries()
      ).forEach(async ([k, v]) => {
        // Thêm các permission vào group
        await PermGr.findByIdAndUpdate(k, {
          $addToSet: {
            perms: v,
          },
        });
      }),
      // Thông báo đến log service
      new LogPublisher(nats.cli).publish({
        userId: req.user?.id,
        model: Perm.modelName,
        act: Actions.insert,
        doc: docs,
      }),
    ]);
  } catch (e) {
    next(e);
  }
};
