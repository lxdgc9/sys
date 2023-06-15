import { RequestHandler } from "express";
import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const writeSchools: RequestHandler = async (req, res, next) => {
  const schools: {
    code: string;
    name: string;
    info: string;
  }[] = req.body;

  const codes = [...new Set(schools.map((el) => el.code))];

  try {
    if (codes.length < schools.length) {
      throw new ConflictErr("Mã trường bị trùng");
    }

    const hasCode = await School.exists({ code: { $in: codes } });
    if (hasCode) {
      throw new ConflictErr("Mã trường đã tồn tại");
    }

    const nSchools = await School.insertMany(
      schools.map((el) => ({
        code: el.code,
        name: el.name,
        info: el.info,
        logo: "/api/courses/def-logo.jpg",
      }))
    );
    res.status(201).json(nSchools);
  } catch (e) {
    next(e);
  }
};

export default writeSchools;
