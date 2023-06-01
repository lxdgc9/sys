import { BadReqErr } from "@lxdgc9/pkg/dist/err";
import { Actions } from "@lxdgc9/pkg/dist/event/log";
import { RequestHandler } from "express";
import { Types } from "mongoose";
import { LogPublisher } from "../../../event/publisher/log";
import { Perm } from "../../../model/perm";
import { PermGr } from "../../../model/perm-gr";
import { nats } from "../../../nats";

export const insertPerms: RequestHandler = async (req, res, next) => {
  const {
    perms,
  }: {
    perms: {
      code: string;
      desc: string;
      groupId: Types.ObjectId;
    }[];
  } = req.body;

  try {
    // Tập hợp mã code và groupId đã được loại bỏ duplicate
    const [codeArr, groupIdArr] = perms
      .reduce(
        (s, { code, groupId }) => {
          s[0].add(code);
          s[1].add(groupId);
          return s;
        },
        [new Set(), new Set()]
      )
      .map((el) => Array.from(el));

    // Nếu danh sách trên có số lượng không đúng bằng số lượng các
    // permission từ đầu vào, tức có phần tử nào đó đã trùng, tiến
    // hành thông báo lỗi
    if (codeArr.length < perms.length) {
      throw new BadReqErr("duplicate code");
    }

    // Tiến hành validate code và group
    const [isDupl, numGroups] = await Promise.all([
      Perm.exists({
        code: {
          $in: codeArr,
        },
      }),
      PermGr.countDocuments({
        _id: {
          $in: groupIdArr,
        },
      }),
    ]);
    if (isDupl) {
      throw new BadReqErr("duplicate code");
    }
    if (numGroups < groupIdArr.length) {
      throw new BadReqErr("groupIds mismatch");
    }

    // Thêm đồng thời perrmission vào db
    const _perms = await Perm.insertMany(
      perms.map(({ code, desc, groupId }) => ({
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
