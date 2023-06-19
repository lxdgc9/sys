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
      throw new ConflictErr("Duplicate code");
    }

    const hasCode = await School.exists({ code: { $in: codes } });
    if (hasCode) {
      throw new ConflictErr("Duplicate code");
    }

    const nSchools = await School.insertMany(
      schools.map(({ code, name, info }) => ({
        code,
        name,
        info,
        logo: "/api/courses/default-logo.jpg",
      }))
    );
    res.status(201).json(nSchools);
  } catch (e) {
    next(e);
  }
};

export default writeSchools;
