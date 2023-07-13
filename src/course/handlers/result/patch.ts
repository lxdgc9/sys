import { RequestHandler } from "express";
import { Types } from "mongoose";
import { Class } from "../../models/class";
import { NotFoundErr } from "@lxdgc9/pkg/dist/err";
import { Result } from "../../models/result";

function cal(
  x1: number,
  x2: number,
  x3: number,
  x4: number,
  x5: number,
  xmid: number,
  xfinal: number
) {
  let a = 0;
  let ok = 0;
  let sum = 0;

  if (Number.isFinite(x1)) {
    a++;
    sum += x1;
  }

  if (Number.isFinite(x2)) {
    a++;
    sum += x2;
  }

  if (Number.isFinite(x3)) {
    a++;
    sum += x3;
  }

  if (Number.isFinite(x4)) {
    a++;
    sum += x4;
  }

  if (Number.isFinite(x5)) {
    a++;
    sum += x5;
  }

  if (a > 0) {
    ok++;
  }

  if (Number.isFinite(xmid)) {
    ok++;
    a += 2;
    sum += xmid * 2;
  }

  if (Number.isFinite(xfinal)) {
    ok++;
    a += 3;
    sum += xfinal * 3;
  }

  if (ok < 3) {
    return null;
  }

  return sum / a;
}

function calFinal(x1: number | null, x2: number | null) {
  if (!x1 || !x2) {
    return null;
  }

  if (Number.isFinite(x1) && Number.isFinite(x2)) {
    return (x1 + x2 * 2) / 3;
  }

  return null;
}

export const patchResult: RequestHandler = async (req, res, next) => {
  console.log("hello world");

  const {
    user_id,
    term1: {
      regular_scores: { score1, score2, score3, score4, score5 },
      midterm_score,
      final_score,
    },
    term2: {
      regular_scores: {
        score1: score6,
        score2: score7,
        score3: score8,
        score4: score9,
        score5: score10,
      },
      midterm_score: midterm_score2,
      final_score: final_score2,
    },
  }: {
    user_id: Types.ObjectId;
    term1: {
      regular_scores: {
        score1: number;
        score2: number;
        score3: number;
        score4: number;
        score5: number;
      };
      midterm_score: number;
      final_score: number;
    };
    term2: {
      regular_scores: {
        score1: number;
        score2: number;
        score3: number;
        score4: number;
        score5: number;
      };
      midterm_score: number;
      final_score: number;
    };
  } = req.body;

  try {
    const [_class] = await Promise.all([Class.findById(req.params.class_id)]);
    if (!_class) {
      throw new NotFoundErr("Invalid class");
    }

    const res1 = cal(
      parseFloat(score1.toString()),
      parseFloat(score2.toString()),
      parseFloat(score3.toString()),
      parseFloat(score4.toString()),
      parseFloat(score5.toString()),
      parseFloat(midterm_score.toString()),
      parseFloat(final_score.toString())
    );
    const res2 = cal(
      parseFloat(score6.toString()),
      parseFloat(score7.toString()),
      parseFloat(score8.toString()),
      parseFloat(score9.toString()),
      parseFloat(score10.toString()),
      parseFloat(midterm_score2.toString()),
      parseFloat(final_score2.toString())
    );

    const result = await Result.findOneAndUpdate(
      {
        user: user_id,
        class_id: _class._id,
      },
      {
        $set: {
          user: user_id,
          class_id: _class._id,
          term1: {
            regular_scores: {
              score1,
              score2,
              score3,
              score4,
              score5,
            },
            midterm_score,
            final_score,
            overall_score: res1,
          },
          term2: {
            regular_scores: {
              score1: score6,
              score2: score7,
              score3: score8,
              score4: score9,
              score5: score10,
            },
            midterm_score: midterm_score2,
            final_score: final_score2,
            overall_score: res2,
          },
          final: {
            average_score_term1: res1,
            average_score_term2: res2,
            average_score: calFinal(res1, res2),
          },
        },
      },
      { upsert: true, new: true }
    ).populate({
      path: "user",
    });

    res.json(result);
  } catch (e) {
    next(e);
  }
};
