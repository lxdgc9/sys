import { RequestHandler } from "express";
import { ConflictErr } from "@lxdgc9/pkg/dist/err";
import { School } from "../../models/school";

const writeSchools: RequestHandler = async (req, res, next) => {
  const schools: {
    code: string;
    name: string;
    address: string;
    description: string;
  }[] = req.body;

  const codes = [...new Set(schools.map((el) => el.code))];

  try {
    if (codes.length < schools.length) {
      throw new ConflictErr("Code already exists");
    }
    const hasCode = await School.exists({ code: { $in: codes } });
    if (hasCode) {
      throw new ConflictErr("Code already exists");
    }

    const nSchools = await School.insertMany(
      schools.map((item) => ({
        code: item.code,
        name: item.name,
        address: item.address,
        description: item.description,
      }))
    );
    res.status(201).json(nSchools);
  } catch (e) {
    next(e);
  }
};

export default writeSchools;
